import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { createShippingLabel } from '../services/shipping.js';
import { sendOrderConfirmation } from '../services/email.js';
import { alertAdmin } from '../services/alert.js';
import { logInfo, logError } from '../services/logger.js';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logError({
      message: 'Webhook signature verification failed',
      error: err.message,
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      logInfo('Duplicate order webhook, skipping', { sessionId: session.id });
      return res.json({ received: true });
    }

    const meta = session.metadata;
    const paintingIds = JSON.parse(meta.paintingIds);

    try {
      const paintings = await prisma.painting.findMany({
        where: { id: { in: paintingIds } },
      });

      const total = paintings.reduce((sum, p) => sum + (p.originalPrice || 0), 0);

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
              price: p.originalPrice || 0,
            })),
          },
        },
        include: { items: { include: { painting: true } } },
      });

      await prisma.painting.updateMany({
        where: { id: { in: paintingIds } },
        data: { originalAvailable: false },
      });

      logInfo(`Order created: ${order.id}`, {
        customerEmail: meta.customerEmail,
        total,
      });

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

        logInfo('Shipping label created', { orderId: order.id, trackingCode });
      } catch (err) {
        logError({
          message: 'Shipping label generation failed',
          orderId: order.id,
          error: err.message,
        });

        await alertAdmin(
          'Shipping Label Generation Failed',
          `Order ${order.id} for ${meta.customerEmail}: ${err.message}. Please generate manually.`
        );
      }

      try {
        await sendOrderConfirmation({
          order,
          trackingCode,
          carrier,
        });

        logInfo('Order confirmation email sent', { orderId: order.id });
      } catch (err) {
        logError({
          message: 'Order confirmation email failed',
          orderId: order.id,
          error: err.message,
        });

        await alertAdmin(
          'Order Confirmation Email Failed',
          `Order ${order.id} for ${meta.customerEmail}: ${err.message}. Please send manually or check email logs.`
        );
      }

      console.info(`✅ Order ${order.id} processed for ${meta.customerEmail}`);
    } catch (err) {
      logError({
        message: 'Order processing failed',
        error: err.message,
      });

      await alertAdmin(
        'Order Processing Failed',
        `Session ${session.id}: ${err.message}. Please investigate immediately.`
      );
    }
  }

  res.json({ received: true });
});

export default router;
