import { analyzeDocument } from '../ai/index.js';

export async function run({ message, file }) {
  if (!file) {
    return { type: 'text', content: 'Please upload a document for me to analyze.' };
  }

  const result = await analyzeDocument({
    fileBase64: file.base64,
    mimeType: file.type || 'application/pdf',
    prompt: message || 'Analyze this document and provide a detailed summary.',
  });

  return { type: 'text', content: result };
}
