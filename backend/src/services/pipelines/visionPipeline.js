import { analyzeImage } from '../ai/index.js';

export async function run({ message, file }) {
  if (!file) {
    return { type: 'text', content: 'Please upload an image for me to analyze.' };
  }

  const result = await analyzeImage({
    imageBase64: file.base64,
    mimeType: file.type,
    prompt: message || 'Describe this image in detail.',
  });

  return { type: 'text', content: result };
}
