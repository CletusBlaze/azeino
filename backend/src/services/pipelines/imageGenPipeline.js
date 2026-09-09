import { generateImage } from '../ai/index.js';

export async function run({ message }) {
  if (!message?.trim()) {
    return { type: 'text', content: 'Please describe the image you want me to generate.' };
  }
  try {
    const imageData = await generateImage({ prompt: message });
    return { type: 'image', content: 'Here is your generated image.', imageData };
  } catch (err) {
    console.error('Image generation failed:', err.message);
    return { type: 'text', content: `Image generation failed: ${err.message}` };
  }
}
