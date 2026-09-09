import { generateText } from '../ai/index.js';
import { analyzeDocument } from '../ai/index.js';

export async function run({ message, history, file, memoryContext = '', personalization = '' }) {
  if (file) {
    const docContent = await analyzeDocument({
      fileBase64: file.base64,
      mimeType: file.type || 'application/pdf',
      prompt: `${message}\n\nProvide clear, structured answers. Number each answer to match the question numbers.`,
    });
    return { type: 'text', content: docContent };
  }

  const messages = [
    {
      role: 'system',
      content: `You are an expert academic tutor. Help students understand concepts, answer questions, create study plans, generate quizzes, and explain difficult topics clearly.
When answering past questions, be thorough and educational.
When generating quizzes, wait for the student's answer before revealing the correct answer.${memoryContext}${personalization ? `

User personalization: ${personalization}` : ''}`,
    },
    ...history,
    { role: 'user', content: message },
  ];

  const result = await generateText({ messages });
  return { type: 'text', content: typeof result === 'string' ? result : result.text };
}
