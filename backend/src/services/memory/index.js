import { query } from '../../config/database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractAndSaveMemory(userId, userMessage, assistantResponse) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const prompt = `Extract any personal facts, preferences, or important information about the user from this conversation.
Only extract clear, specific facts (name, location, job, preferences, goals, projects, etc.).
Return a JSON array of objects with "content" and "memory_type" fields.
memory_type must be one of: preference, fact, context, project
If nothing worth remembering, return an empty array [].

User said: "${userMessage}"
Assistant responded: "${assistantResponse.substring(0, 500)}"

Return only valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return;

    const memories = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(memories) || memories.length === 0) return;

    for (const mem of memories) {
      if (!mem.content || !mem.memory_type) continue;
      const validTypes = ['preference', 'fact', 'context', 'project'];
      const memType = validTypes.includes(mem.memory_type) ? mem.memory_type : 'fact';
      await query(
        'INSERT INTO user_memory (user_id, content, memory_type) VALUES ($1, $2, $3)',
        [userId, mem.content, memType]
      );
    }
  } catch {
    // Memory extraction is non-critical, fail silently
  }
}

export async function loadMemoryContext(userId) {
  try {
    const result = await query(
      'SELECT content, memory_type FROM user_memory WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    if (!result.rows.length) return '';
    const facts = result.rows.map((m) => `- ${m.content}`).join('\n');
    return `\nWhat you know about this user:\n${facts}\n`;
  } catch {
    return '';
  }
}
