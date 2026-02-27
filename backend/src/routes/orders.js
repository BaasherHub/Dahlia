// src/routes/orders.js
import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CheckoutSchema = z.object({
  paintingIds: z.array(z.string()).min(1),
  customerEmail: z.string().email(),
  shipping: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
});

// POST /api/orders/checkout — create Stripe session
router.post('/checkout', async (req, res) => {
  const data = CheckoutSchema.parse(req.body);

  // Fetch paintings from DB
  const paintings = await prisma.painting.findMany({
    where: { id: { in: data.paintingIds }, sold: false },
  });

  if (paintings.length !== data.paintingIds.length) {
    return res.status(400).json({ error: 'One or more paintings are unavailable.' });
  }

  // Build Stripe line items
  const lineItems = paintings.map((p) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: p.title,
        description: `${p.medium} · ${p.dimensions}`,
        images: p.images.slice(0, 1),
      },
      unit_amount: Math.round(p.price * 100),
    },
    quantity: 1,
  }));

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: data.customerEmail,
    success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    metadata: {
      paintingIds: JSON.stringify(data.paintingIds),
      customerEmail: data.customerEmail,
      customerName: data.shipping.name,
      shipName: data.shipping.name,
      shipStreet: data.shipping.street,
      shipCity: data.shipping.city,
      shipState: data.shipping.state,
      shipZip: data.shipping.zip,
      shipCountry: data.shipping.country,
      shipPhone: data.shipping.phone || '',
    },
  });

  res.json({ url: session.url });
});

// GET /api/orders/:sessionId — fetch order by stripe session
router.get('/session/:sessionId', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: req.params.sessionId },
    include: { items: { include: { painting: true } } },
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

export default router;
