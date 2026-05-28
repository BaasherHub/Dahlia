import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: 'Too many checkout attempts, please try again later.',
});

const CheckoutItemSchema = z.object({
  paintingId: z.string(),
  type: z.enum(['original', 'print']),
});

const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1).max(20),
  customerEmail: z.string().email(),
  customerName: z.string().min(1).max(100),
  shipping: z.object({
    name: z.string().min(1).max(100),
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    zip: z.string().max(20).optional(),
    country: z.string().min(2).max(100),
    phone: z.string().optional(),
  }),
});

async function releaseCheckoutHold(paintingIds) {
  if (!paintingIds?.length) return;
  await prisma.painting.updateMany({
    where: { id: { in: paintingIds }, sold: false },
    data: { originalAvailable: true },
  });
}

router.post('/checkout', checkoutLimiter, async (req, res) => {
  const data = CheckoutSchema.parse(req.body);
  const paintingIds = data.items.map((i) => i.paintingId);
  let heldOriginalIds = [];

  try {
    const paintings = await prisma.$transaction(async (tx) => {
      const held = [];
      const found = await tx.painting.findMany({
        where: { id: { in: paintingIds } },
      });

      if (found.length !== paintingIds.length) {
        const err = new Error('One or more paintings were not found.');
        err.status = 400;
        throw err;
      }

      for (const item of data.items) {
        const p = found.find((x) => x.id === item.paintingId);
        const price = item.type === 'print' ? p.printPrice : p.originalPrice;
        const available =
          item.type === 'print'
            ? p.printAvailable
            : p.originalAvailable && !p.sold;

        if (!available || (price ?? 0) <= 0) {
          const err = new Error(`"${p.title}" is not available for purchase.`);
          err.status = 400;
          throw err;
        }

        if (item.type === 'original') {
          const holdResult = await tx.painting.updateMany({
            where: {
              id: item.paintingId,
              originalAvailable: true,
              sold: false,
            },
            data: { originalAvailable: false },
          });
          if (holdResult.count !== 1) {
            const err = new Error(`"${p.title}" was just purchased or is no longer available.`);
            err.status = 400;
            throw err;
          }
          held.push(item.paintingId);
        }
      }

      heldOriginalIds = held;
      return found;
    });

    const lineItems = [];
    for (const item of data.items) {
      const p = paintings.find((x) => x.id === item.paintingId);
      const price = item.type === 'print' ? p.printPrice : p.originalPrice;
      const priceInCents = Math.round(price * 100);
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${p.title} (${item.type})`,
            description: `${p.medium} · ${p.dimensions}`,
            images: p.images.slice(0, 1),
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: data.customerEmail,
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?checkout=cancelled`,
      metadata: {
        items: JSON.stringify(data.items),
        heldOriginals: JSON.stringify(heldOriginalIds),
        customerEmail: data.customerEmail,
        customerName: data.shipping.name,
        shipName: data.shipping.name,
        shipStreet: data.shipping.street,
        shipCity: data.shipping.city,
        shipState: data.shipping.state,
        shipZip: data.shipping.zip || '',
        shipCountry: data.shipping.country,
        shipPhone: data.shipping.phone || '',
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    await releaseCheckoutHold(heldOriginalIds);
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || 'Checkout failed',
    });
  }
});

const ReleaseHoldSchema = z.object({
  sessionId: z.string().min(1),
});

router.post('/release-hold', checkoutLimiter, async (req, res) => {
  const { sessionId } = ReleaseHoldSchema.parse(req.body);

  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (existing) {
    return res.json({ ok: true, released: false, reason: 'order_completed' });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return res.status(400).json({ error: 'Invalid checkout session' });
  }

  if (session.payment_status === 'paid') {
    return res.json({ ok: true, released: false, reason: 'already_paid' });
  }

  let heldOriginals = [];
  try {
    heldOriginals = JSON.parse(session.metadata?.heldOriginals || '[]');
  } catch {
    heldOriginals = [];
  }

  if (heldOriginals.length > 0) {
    await releaseCheckoutHold(heldOriginals);
  }

  res.json({ ok: true, released: heldOriginals.length > 0 });
});

router.get('/session/:sessionId', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: req.params.sessionId },
    include: { items: { include: { painting: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

export default router;
