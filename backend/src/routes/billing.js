import crypto from 'crypto';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

// Prices in NGN kobo (Paystack uses smallest currency unit)
export const PLANS = {
  free:     { messages: 20,    label: 'Free',     priceNGN: 0,       amount: 0 },
  plus:     { messages: 500,   label: 'Plus',     priceNGN: 4000,    amount: 400000 },
  pro:      { messages: 2000,  label: 'Pro',      priceNGN: 8000,    amount: 800000 },
  business: { messages: 10000, label: 'Business', priceNGN: 20000,   amount: 2000000 },
};

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

async function paystackPost(path, body) {
  const res = await fetch(`https://api.paystack.co${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

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

  // Initialize Paystack transaction
  app.post('/checkout', { preHandler: authenticate }, async (req, reply) => {
    const { plan } = req.body;
    const planData = PLANS[plan];
    if (!planData || plan === 'free') return reply.code(400).send({ error: 'Invalid plan' });

    const userResult = await query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    const email = userResult.rows[0]?.email;
    if (!email) return reply.code(400).send({ error: 'User not found' });

    const data = await paystackPost('/transaction/initialize', {
      email,
      amount: planData.amount,
      currency: 'NGN',
      callback_url: `${process.env.FRONTEND_URL}/app/billing?success=1`,
      metadata: { userId: req.user.id, plan, cancel_action: `${process.env.FRONTEND_URL}/app/billing` },
    });

    if (!data.status) return reply.code(500).send({ error: data.message || 'Paystack error' });
    return reply.send({ url: data.data.authorization_url });
  });

  // Paystack webhook
  app.post('/webhook', async (req, reply) => {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return reply.code(400).send({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { userId, plan } = event.data.metadata || {};
      if (userId && plan && PLANS[plan]) {
        await query(
          'UPDATE users SET plan = $1, paystack_customer_code = $2 WHERE id = $3',
          [plan, event.data.customer?.customer_code || null, userId]
        );
      }
    }

    return reply.send({ received: true });
  });
}
