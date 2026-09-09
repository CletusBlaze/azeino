import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';

import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';
import fileRoutes from './routes/files.js';
import memoryRoutes from './routes/memory.js';
import usageRoutes from './routes/usage.js';
import imageRoutes from './routes/images.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

await app.register(multipart, {
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

app.register(authRoutes, { prefix: '/api/auth' });
app.register(conversationRoutes, { prefix: '/api/conversations' });
app.register(messageRoutes, { prefix: '/api/messages' });
app.register(fileRoutes, { prefix: '/api/files' });
app.register(memoryRoutes, { prefix: '/api/memory' });
app.register(usageRoutes, { prefix: '/api/usage' });
app.register(imageRoutes, { prefix: '/api/images' });

app.get('/health', async () => ({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Backend running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
