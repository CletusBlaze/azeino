import { generateText } from '../ai/index.js';

export async function run({ message, history, memoryContext = '', personalization = '' }) {
  const messages = [
    {
      role: 'system',
      content: `You are an expert software engineer. Help with code explanation, debugging, generation, and optimization.
Format all code in proper markdown code blocks with the correct language identifier.
Be precise, practical, and explain your reasoning.${memoryContext}${personalization ? `

User personalization: ${personalization}` : ''}`,
    },
    ...history,
    { role: 'user', content: message },
  ];

  const result = await generateText({ messages });
  return { type: 'text', content: typeof result === 'string' ? result : result.text };
}
