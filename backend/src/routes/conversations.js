import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

export default async function conversationRoutes(app) {
  app.get('/', { preHandler: authenticate }, async (request, reply) => {
    const result = await query(
      'SELECT id, title, created_at, updated_at FROM conversations WHERE user_id = $1 AND is_archived = false ORDER BY updated_at DESC',
      [request.user.id]
    );
    return reply.send(result.rows);
  });

  app.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { title = 'New Chat' } = request.body || {};
    const result = await query(
      'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *',
      [request.user.id, title]
    );
    return reply.code(201).send(result.rows[0]);
  });

  app.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params;
    const conv = await query(
      'SELECT * FROM conversations WHERE id = $1 AND user_id = $2',
      [id, request.user.id]
    );
    if (!conv.rows.length) return reply.code(404).send({ error: 'Conversation not found' });

    const messages = await query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );
    return reply.send({ ...conv.rows[0], messages: messages.rows });
  });

  app.patch('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params;
    const { title, is_archived } = request.body;
    const result = await query(
      'UPDATE conversations SET title = COALESCE($1, title), is_archived = COALESCE($2, is_archived), updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, is_archived, id, request.user.id]
    );
    if (!result.rows.length) return reply.code(404).send({ error: 'Conversation not found' });
    return reply.send(result.rows[0]);
  });

  app.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params;
    await query('DELETE FROM conversations WHERE id = $1 AND user_id = $2', [id, request.user.id]);
    return reply.send({ success: true });
  });
}
