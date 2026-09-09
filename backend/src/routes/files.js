import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';

export default async function fileRoutes(app) {
  app.get('/', { preHandler: authenticate }, async (request, reply) => {
    const result = await query(
      'SELECT id, file_name, file_type, file_size, purpose, created_at FROM files WHERE user_id = $1 ORDER BY created_at DESC',
      [request.user.id]
    );
    return reply.send(result.rows);
  });

  app.post('/upload', { preHandler: authenticate }, async (request, reply) => {
    const data = await request.file();
    if (!data) return reply.code(400).send({ error: 'No file provided' });

    const chunks = [];
    for await (const chunk of data.file) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString('base64');

    // Store file metadata in DB (actual file goes to cloud storage in Stage 4)
    const result = await query(
      'INSERT INTO files (user_id, file_name, file_type, file_size, file_base64, purpose) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, file_name, file_type, file_size, purpose, created_at',
      [request.user.id, data.filename, data.mimetype, buffer.length, base64, 'upload']
    );

    return reply.code(201).send(result.rows[0]);
  });

  app.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    await query('DELETE FROM files WHERE id = $1 AND user_id = $2', [request.params.id, request.user.id]);
    return reply.send({ success: true });
  });
}
