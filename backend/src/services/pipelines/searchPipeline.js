import { generateWithSearch } from '../ai/index.js';

export async function run({ message, history, memoryContext = '', personalization = '' }) {
  const messages = [
    {
      role: 'system',
      content: `You are a research assistant with access to current web information. Always cite your sources. Be accurate and up to date.${memoryContext}${personalization ? `

User personalization: ${personalization}` : ''}`,
    },
    ...history,
    { role: 'user', content: message },
  ];

  const result = await generateWithSearch({ messages });
  return {
    type: 'text',
    content: result.text || result,
    sources: result.sources || [],
  };
}
