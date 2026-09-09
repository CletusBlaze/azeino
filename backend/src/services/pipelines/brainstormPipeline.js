import { generateText } from '../ai/index.js';

export async function run({ message, history, memoryContext = '', personalization = '' }) {
  const messages = [
    {
      role: 'system',
      content: `You are a strategic business and creative thinking partner. Help with brainstorming ideas, business planning, SWOT analysis, market research, startup validation, pitch decks, and creative problem solving.
Be structured, practical, and insightful. Use frameworks where helpful (SWOT, PESTLE, Business Model Canvas, etc.).
Format responses clearly with headers and bullet points when appropriate.${memoryContext}${personalization ? `

User personalization: ${personalization}` : ''}`,
    },
    ...history,
    { role: 'user', content: message },
  ];

  const result = await generateText({ messages });
  return { type: 'text', content: typeof result === 'string' ? result : result.text };
}
