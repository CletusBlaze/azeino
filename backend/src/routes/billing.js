import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const PLANS = {
  free:     { messages: 20,   label: 'Free',     price: 0 },
  plus:     { messages: 500,  label: 'Plus',     price: 9 },
  pro:      { messages: 2000, label: 'Pro',      price: 19 },
  business: { messages: 10000,label: 'Business', price: 49 },
};

export default async function billingRoutes(app) {
  // Get current plan + usage
  app.get('/plan', { preHandler: authenticate }, async (req, reply) => {
    const user = await query('SELECT plan FROM users WHERE id = $1', [req.user.id]);
    const plan = user.rows[0]?.plan || 'free';
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const usage = await query(
      'SELECT COUNT(*) FROM usage_logs WHERE user_id = $1 AND created_at >= $2',
      [req.user.id, startOfMonth]
    );
    const used = parseInt(usage.rows[0].count);
    const limit = PLANS[plan]?.messages || 20;
    return reply.send({ plan, used, limit, remaining: Math.max(0, limit - used) });
  });

  // Create Stripe checkout session
  app.post('/checkout', { preHandler: authenticate }, async (req, reply) => {
    const { plan } = req.body;
    const priceIds = {
      plus:     process.env.STRIPE_PRICE_PLUS,
      pro:      process.env.STRIPE_PRICE_PRO,
      business: process.env.STRIPE_PRICE_BUSINESS,
    };
    const priceId = priceIds[plan];
    if (!priceId) return reply.code(400).send({ error: 'Invalid plan' });

    const userResult = await query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userResult.rows[0]?.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/app/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/app/billing`,
      metadata: { userId: req.user.id, plan },
    });
    return reply.send({ url: session.url });
  });

  // Stripe customer portal
  app.post('/portal', { preHandler: authenticate }, async (req, reply) => {
    const userResult = await query('SELECT stripe_customer_id FROM users WHERE id = $1', [req.user.id]);
    const customerId = userResult.rows[0]?.stripe_customer_id;
    if (!customerId) return reply.code(400).send({ error: 'No subscription found' });
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/app/billing`,
    });
    return reply.send({ url: session.url });
  });

  // Stripe webhook
  app.post('/webhook', { config: { rawBody: true } }, async (req, reply) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return reply.code(400).send({ error: 'Webhook signature failed' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, plan } = session.metadata;
      await query('UPDATE users SET plan = $1, stripe_customer_id = $2 WHERE id = $3',
        [plan, session.customer, userId]);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      await query('UPDATE users SET plan = $1 WHERE stripe_customer_id = $2',
        ['free', sub.customer]);
    }

    return reply.send({ received: true });
  });
}
