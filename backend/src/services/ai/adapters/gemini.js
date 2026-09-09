import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateText({ messages, model = 'gemini-3.6-flash', useSearch = false }) {
  const geminiModel = genAI.getGenerativeModel({
    model,
    ...(useSearch && { tools: [{ googleSearch: {} }] }),
  });

  const systemMsg = messages.find((m) => m.role === 'system');
  const nonSystem = messages.filter((m) => m.role !== 'system');

  if (useSearch) {
    const contents = nonSystem
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    // Ensure first message is user
    const validContents = contents[0]?.role === 'model' ? contents.slice(1) : contents;
    const searchConfig = systemMsg
      ? { systemInstruction: { parts: [{ text: systemMsg.content }] } }
      : {};
    const searchModel = genAI.getGenerativeModel({ model, tools: [{ googleSearch: {} }], ...searchConfig });
    const result = await searchModel.generateContent({ contents: validContents });
    const response = result.response;
    return { text: response.text(), sources: extractSources(response) };
  }

  const history = nonSystem.slice(0, -1)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    .filter((_, i, arr) => i === 0 ? arr[0].role === 'user' : true);

  // Ensure history starts with user
  const validHistory = history[0]?.role === 'model' ? history.slice(1) : history;

  const lastMessage = nonSystem[nonSystem.length - 1].content;
  const chatConfig = systemMsg
    ? { history: validHistory, systemInstruction: { parts: [{ text: systemMsg.content }] } }
    : { history: validHistory };
  const chat = geminiModel.startChat(chatConfig);
  const result = await chat.sendMessage(lastMessage);
  const response = result.response;

  return { text: response.text(), sources: extractSources(response) };
}

export async function analyzeDocument({ fileBase64, mimeType = 'application/pdf', prompt, model = 'gemini-3.6-flash' }) {
  const geminiModel = genAI.getGenerativeModel({ model });
  const result = await geminiModel.generateContent([
    { inlineData: { data: fileBase64, mimeType } },
    prompt,
  ]);
  return result.response.text();
}

export async function analyzeImage({ imageBase64, mimeType = 'image/jpeg', prompt, model = 'gemini-3.6-flash' }) {
  const geminiModel = genAI.getGenerativeModel({ model });
  const result = await geminiModel.generateContent([
    { inlineData: { data: imageBase64, mimeType } },
    prompt,
  ]);
  return result.response.text();
}

function extractSources(response) {
  try {
    const candidates = response.candidates || [];
    const groundingMetadata = candidates[0]?.groundingMetadata;
    if (!groundingMetadata?.groundingChunks) return [];

    return groundingMetadata.groundingChunks
      .filter((chunk) => chunk.web)
      .map((chunk) => ({ title: chunk.web.title, url: chunk.web.uri }));
  } catch {
    return [];
  }
}
