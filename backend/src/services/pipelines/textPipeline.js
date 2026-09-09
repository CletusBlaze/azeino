import { generateText } from '../ai/index.js';

export async function run({ message, history, memoryContext = '', personalization = '' }) {
  const messages = [
    { role: 'system', content: `You are a helpful, intelligent AI assistant. Be concise and accurate.${memoryContext}${personalization ? `

User personalization: ${personalization}` : ''}` },
    ...history,
    { role: 'user', content: message },
  ];

  const result = await generateText({ messages });
  return { type: 'text', content: typeof result === 'string' ? result : result.text };
}
