import { authenticate } from '../middleware/auth.js';
import { query } from '../config/database.js';
import { orchestrate } from '../services/orchestrator/index.js';
import { extractAndSaveMemory, loadMemoryContext } from '../services/memory/index.js';

export default async function messageRoutes(app) {
  app.post('/:conversationId/messages', { preHandler: authenticate }, async (request, reply) => {
    const { conversationId } = request.params;
    const { message, fileId, contextHint, personalization } = request.body;

    // Verify conversation belongs to user
    const conv = await query(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [conversationId, request.user.id]
    );
    if (!conv.rows.length) return reply.code(404).send({ error: 'Conversation not found' });

    // Load conversation history (last 20 messages for context)
    const historyResult = await query(
      `SELECT role, content FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC LIMIT 20`,
      [conversationId]
    );
    const history = historyResult.rows.reverse();

    // Load file if provided
    let file = null;
    if (fileId) {
      const fileResult = await query('SELECT * FROM files WHERE id = $1 AND user_id = $2', [fileId, request.user.id]);
      if (fileResult.rows.length) {
        const row = fileResult.rows[0];
        file = { ...row, base64: row.file_base64, type: row.file_type };
      }
    }

    // Save user message
    await query(
      'INSERT INTO messages (conversation_id, role, content, content_type) VALUES ($1, $2, $3, $4)',
      [conversationId, 'user', message, 'text']
    );

    // Update conversation timestamp
    await query('UPDATE conversations SET updated_at = NOW() WHERE id = $1', [conversationId]);

    // Load memory context
    const memoryContext = await loadMemoryContext(request.user.id);

    // Run orchestrator
    const result = await orchestrate({ message, history, file, contextHint, memoryContext, personalization: personalization || '' });

    // Save assistant message
    const saved = await query(
      'INSERT INTO messages (conversation_id, role, content, content_type, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        conversationId,
        'assistant',
        result.content,
        result.type || 'text',
        JSON.stringify({ sources: result.sources || [], imageData: result.imageData || null }),
      ]
    );

    // Extract and save memory in background
    extractAndSaveMemory(request.user.id, message, result.content);

    // Log usage
    query(
      'INSERT INTO usage_logs (user_id, capability, tokens_used) VALUES ($1, $2, $3)',
      [request.user.id, result.intent || 'text', result.content?.length || 0]
    ).catch(() => {});

    return reply.send({
      message: saved.rows[0],
      sources: result.sources || [],
      imageData: result.imageData || null,
    });
  });
}
