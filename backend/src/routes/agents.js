import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import { runAgent } from '../services/agents/runner.js';
import { v4 as uuidv4 } from 'uuid';

export default async function agentRoutes(app) {
  // List agent runs
  app.get('/', { preHandler: authenticate }, async (req, reply) => {
    const result = await query(
      'SELECT id, task, status, result, steps, created_at, completed_at FROM agent_runs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    return reply.send(result.rows);
  });

  // Get single agent run
  app.get('/:id', { preHandler: authenticate }, async (req, reply) => {
    const result = await query(
      'SELECT * FROM agent_runs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return reply.code(404).send({ error: 'Not found' });
    return reply.send(result.rows[0]);
  });

  // Create and run agent task
  app.post('/', { preHandler: authenticate }, async (req, reply) => {
    const { task, conversationId } = req.body;
    if (!task?.trim()) return reply.code(400).send({ error: 'Task is required' });

    const id = uuidv4();
    await query(
      'INSERT INTO agent_runs (id, user_id, task, status, steps) VALUES ($1, $2, $3, $4, $5)',
      [id, req.user.id, task, 'pending', '[]']
    );

    // Run agent in background
    runAgent(id, req.user.id, task, conversationId).catch(console.error);

    return reply.code(202).send({ id, status: 'pending' });
  });

  // Delete agent run
  app.delete('/:id', { preHandler: authenticate }, async (req, reply) => {
    await query('DELETE FROM agent_runs WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    return reply.send({ ok: true });
  });
}
