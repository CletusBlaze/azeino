import supabase from '../config/supabase.js';

export async function authenticate(request, reply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }

  request.user = user;
}
