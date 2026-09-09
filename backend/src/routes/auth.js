import supabase from '../config/supabase.js';

export default async function authRoutes(app) {
  app.post('/register', async (request, reply) => {
    const { email, password, name } = request.body;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { display_name: name },
      email_confirm: false,
    });
    if (error) return reply.code(400).send({ error: error.message });
    return reply.code(201).send({ user: data.user });
  });

  app.post('/login', async (request, reply) => {
    const { email, password } = request.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return reply.code(401).send({ error: error.message });
    return reply.send({ user: data.user, session: data.session });
  });

  app.post('/logout', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (token) await supabase.auth.admin.signOut(token);
    return reply.send({ success: true });
  });
}
