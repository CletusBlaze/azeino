import { analyzeImage } from '../ai/index.js';
import { generateImage } from '../ai/index.js';

export async function run({ message, file }) {
  if (!file) {
    return { type: 'text', content: 'Please upload the image you want to edit, then describe the changes.' };
  }
  if (!message?.trim()) {
    return { type: 'text', content: 'Please describe what changes you want to make to the image.' };
  }

  try {
    // First analyze the image to get a description
    const description = await analyzeImage({
      imageBase64: file.base64,
      mimeType: file.type,
      prompt: 'Describe this image in detail so it can be recreated.',
    });

    // Then generate a new image with the edits applied
    const editPrompt = `${description}. Now apply these changes: ${message}`;
    const imageData = await generateImage({ prompt: editPrompt });
    return { type: 'image', content: `I've applied your edits: "${message}"`, imageData };
  } catch (err) {
    console.error('Image edit failed:', err.message);
    return { type: 'text', content: `Image editing failed: ${err.message}` };
  }
}
