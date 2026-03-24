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

router.post('/checkout', checkoutLimiter, async (req, res) => {
  const data = CheckoutSchema.parse(req.body);
  const paintingIds = data.items.map((i) => i.paintingId);

  const paintings = await prisma.painting.findMany({
    where: { id: { in: paintingIds } },
  });

  if (paintings.length !== paintingIds.length) {
    return res.status(400).json({
      error: 'One or more paintings were not found.',
    });
  }

  const lineItems = [];
  for (const item of data.items) {
    const p = paintings.find((x) => x.id === item.paintingId);
    if (!p) continue;
    const price = item.type === 'print' ? p.printPrice : p.originalPrice;
    const available = item.type === 'print' ? p.printAvailable : p.originalAvailable;
    if (!available || (price ?? 0) <= 0) {
      return res.status(400).json({
        error: `"${p.title}" (${item.type}) is not available for purchase.`,
      });
    }
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
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    metadata: {
      items: JSON.stringify(data.items),
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

  res.json({ url: session.url });
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
