import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

export default async function usageRoutes(app) {
  app.get('/', { preHandler: authenticate }, async (request, reply) => {
    const [byCapability, totals] = await Promise.all([
      query(
        `SELECT capability, COUNT(*) as count
         FROM usage_logs WHERE user_id = $1
         AND created_at >= date_trunc('month', NOW())
         GROUP BY capability ORDER BY count DESC`,
        [request.user.id]
      ),
      query(
        `SELECT COUNT(*) as total_this_month,
          (SELECT COUNT(*) FROM usage_logs WHERE user_id = $1) as total_all_time
         FROM usage_logs WHERE user_id = $1
         AND created_at >= date_trunc('month', NOW())`,
        [request.user.id]
      ),
    ]);
    return reply.send({
      byCapability: byCapability.rows,
      totalThisMonth: parseInt(totals.rows[0]?.total_this_month || 0),
      totalAllTime: parseInt(totals.rows[0]?.total_all_time || 0),
    });
  });
}
