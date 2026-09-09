import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateText({ messages, model = 'gpt-4o', stream = false }) {
  if (stream) {
    return client.chat.completions.create({ model, messages, stream: true });
  }
  const res = await client.chat.completions.create({ model, messages });
  return res.choices[0].message.content;
}

export async function analyzeImage({ imageUrl, imageBase64, mimeType = 'image/jpeg', prompt, model = 'gpt-4o' }) {
  const imageContent = imageBase64
    ? { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
    : { type: 'image_url', image_url: { url: imageUrl } };

  const res = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: [imageContent, { type: 'text', text: prompt }] }],
  });
  return res.choices[0].message.content;
}

export async function generateImage({ prompt, size = '1024x1024', quality = 'standard' }) {
  const res = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size,
    quality,
  });
  return res.data[0].b64_json || res.data[0].url;
}

export async function generateEmbedding({ text, model = 'text-embedding-3-small' }) {
  const res = await client.embeddings.create({ model, input: text });
  return res.data[0].embedding;
}
