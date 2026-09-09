import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

export default async function imageRoutes(app) {
  app.get('/', { preHandler: authenticate }, async (request, reply) => {
    const result = await query(
      'SELECT id, prompt, storage_url, created_at FROM images WHERE user_id = $1 ORDER BY created_at DESC',
      [request.user.id]
    );
    return reply.send(result.rows);
  });
}
