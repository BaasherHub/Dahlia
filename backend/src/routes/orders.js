import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: 'Too many checkout attempts, please try again later.',
});

const CheckoutSchema = z.object({
  paintingIds: z.array(z.string()).min(1).max(20),
  customerEmail: z.string().email(),
  shipping: z.object({
    name: z.string().min(1).max(100),
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    zip: z.string().min(1).max(20),
    country: z.string().min(2).max(2),
    phone: z.string().optional(),
  }),
});

router.post('/checkout', checkoutLimiter, async (req, res) => {
  const data = CheckoutSchema.parse(req.body);

  const paintings = await prisma.painting.findMany({
    where: {
      id: { in: data.paintingIds },
      originalAvailable: true,
    },
  });

  if (paintings.length !== data.paintingIds.length) {
    return res.status(400).json({
      error: 'One or more paintings are unavailable.',
    });
  }

  const lineItems = paintings.map((p) => {
    const priceInCents = Math.round((p.originalPrice || 0) * 100);
    if (priceInCents <= 0) {
      throw new Error(`Invalid price for painting ${p.id}`);
    }
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: p.title,
          description: `${p.medium} · ${p.dimensions}`,
          images: p.images.slice(0, 1),
        },
        unit_amount: priceInCents,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: data.customerEmail,
    success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
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
