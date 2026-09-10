import webpush from 'web-push';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

webpush.setVapidDetails(
  'mailto:' + (process.env.VAPID_EMAIL || 'admin@azeino.com'),
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export default async function pushRoutes(app) {
  // Get VAPID public key
  app.get('/vapid-key', async (req, reply) => {
    return reply.send({ publicKey: process.env.VAPID_PUBLIC_KEY });
  });

  // Save push subscription
  app.post('/subscribe', { preHandler: authenticate }, async (req, reply) => {
    const { subscription } = req.body;
    await query(
      `INSERT INTO push_subscriptions (user_id, subscription)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET subscription = $2, updated_at = NOW()`,
      [req.user.id, JSON.stringify(subscription)]
    );
    return reply.send({ ok: true });
  });

  // Remove push subscription
  app.delete('/subscribe', { preHandler: authenticate }, async (req, reply) => {
    await query('DELETE FROM push_subscriptions WHERE user_id = $1', [req.user.id]);
    return reply.send({ ok: true });
  });
}

// Helper — send push to a user (called from other services)
export async function sendPushToUser(userId, title, body, url = '/app/explore') {
  try {
    const result = await query('SELECT subscription FROM push_subscriptions WHERE user_id = $1', [userId]);
    if (!result.rows.length) return;
    const subscription = JSON.parse(result.rows[0].subscription);
    await webpush.sendNotification(subscription, JSON.stringify({ title, body, url }));
  } catch (err) {
    // Subscription expired — clean it up
    if (err.statusCode === 410) {
      await query('DELETE FROM push_subscriptions WHERE user_id = $1', [userId]);
    }
  }
}
