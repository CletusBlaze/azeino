import { query } from '../config/database.js';
import { PLANS } from '../routes/billing.js';

export async function checkUsageLimit(request, reply) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const userResult = await query('SELECT plan FROM users WHERE id = $1', [request.user.id]);
  const plan = userResult.rows[0]?.plan || 'free';
  const limit = PLANS[plan]?.messages || 20;

  const usageResult = await query(
    'SELECT COUNT(*) FROM usage_logs WHERE user_id = $1 AND created_at >= $2',
    [request.user.id, startOfMonth]
  );
  const used = parseInt(usageResult.rows[0].count);

  if (used >= limit) {
    return reply.code(429).send({
      error: 'Monthly message limit reached',
      plan,
      used,
      limit,
      upgradeUrl: '/app/billing',
    });
  }
}
