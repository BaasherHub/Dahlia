// src/routes/webhook.js
// This is the automation engine:
// Stripe calls this after payment → we create the order, mark painting sold,
// generate shipping label, and send confirmation email — all automatically.

import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { createShippingLabel } from '../services/shipping.js';
import { sendOrderConfirmation } from '../services/email.js';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Prevent duplicate processing
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) return res.json({ received: true });

    const meta = session.metadata;
    const paintingIds = JSON.parse(meta.paintingIds);

    // Fetch paintings
    const paintings = await prisma.painting.findMany({
      where: { id: { in: paintingIds } },
    });

    const total = paintings.reduce((sum, p) => sum + p.price, 0);

    // ── 1. Create order in DB ─────────────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        stripePaymentId: session.payment_intent,
        stripeSessionId: session.id,
        status: 'PAID',
        customerEmail: meta.customerEmail,
        customerName: meta.customerName,
        shipName: meta.shipName,
        shipStreet: meta.shipStreet,
        shipCity: meta.shipCity,
        shipState: meta.shipState,
        shipZip: meta.shipZip,
        shipCountry: meta.shipCountry,
        shipPhone: meta.shipPhone || null,
        total,
        items: {
          create: paintings.map((p) => ({
            paintingId: p.id,
            price: p.price,
          })),
        },
      },
      include: { items: { include: { painting: true } } },
    });

    // ── 2. Mark paintings as sold ─────────────────────────────────────────────
    await prisma.painting.updateMany({
      where: { id: { in: paintingIds } },
      data: { sold: true },
    });

    // ── 3. Generate shipping label ────────────────────────────────────────────
    let trackingCode, labelUrl, carrier;
    try {
      const label = await createShippingLabel(order);
      trackingCode = label.trackingCode;
      labelUrl = label.labelUrl;
      carrier = label.carrier;

      await prisma.order.update({
        where: { id: order.id },
        data: { trackingCode, labelUrl, carrier, status: 'SHIPPED' },
      });
    } catch (err) {
      console.error('Shipping label error:', err.message);
      // Don't fail the webhook — Dahlia can generate label manually
    }

    // ── 4. Send confirmation email ────────────────────────────────────────────
    try {
      await sendOrderConfirmation({
        order,
        trackingCode,
        carrier,
      });
    } catch (err) {
      console.error('Email error:', err.message);
    }

    console.log(`✅ Order ${order.id} processed for ${meta.customerEmail}`);
  }

  res.json({ received: true });
});

export default router;
