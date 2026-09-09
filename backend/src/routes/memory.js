import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

export default async function memoryRoutes(app) {
  app.get('/', { preHandler: authenticate }, async (request, reply) => {
    const result = await query(
      'SELECT * FROM user_memory WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [request.user.id]
    );
    return reply.send(result.rows);
  });

  app.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    await query('DELETE FROM user_memory WHERE id = $1 AND user_id = $2', [request.params.id, request.user.id]);
    return reply.send({ success: true });
  });

  app.post('/disable', { preHandler: authenticate }, async (request, reply) => {
    await query('UPDATE user_memory SET is_active = false WHERE user_id = $1', [request.user.id]);
    return reply.send({ success: true });
  });
}
