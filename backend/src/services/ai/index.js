import { AI_PROVIDERS } from '../../config/ai.js';
import * as openai from './adapters/openai.js';
import * as gemini from './adapters/gemini.js';

const adapters = { openai, gemini };

function getAdapter(task) {
  const config = AI_PROVIDERS[task];
  return { adapter: adapters[config.primary], config };
}

export async function generateText(options) {
  const { adapter, config } = getAdapter('text');
  try {
    return await adapter.generateText({ ...options, model: config.model });
  } catch (err) {
    console.error(`Primary text provider failed, trying fallback:`, err.message);
    const fallback = adapters[config.fallback];
    return fallback.generateText({ ...options, model: config.fallbackModel });
  }
}

export async function generateWithSearch(options) {
  const { adapter, config } = getAdapter('search');
  try {
    return await adapter.generateText({ ...options, model: config.model, useSearch: true });
  } catch (err) {
    console.error(`Search provider failed:`, err.message);
    return adapters[config.fallback].generateText({ ...options, model: config.fallbackModel });
  }
}

export async function analyzeImage(options) {
  const { adapter, config } = getAdapter('vision');
  try {
    return await adapter.analyzeImage({ ...options, model: config.model });
  } catch (err) {
    console.error(`Vision provider failed, trying fallback:`, err.message);
    return adapters[config.fallback].analyzeImage({ ...options, model: config.fallbackModel });
  }
}

export async function analyzeDocument(options) {
  const { adapter, config } = getAdapter('document');
  try {
    return await adapter.analyzeDocument({ ...options, model: config.model });
  } catch (err) {
    console.error(`Document provider failed, trying fallback:`, err.message);
    return adapters[config.fallback].analyzeImage({ ...options, model: config.fallbackModel });
  }
}

export async function generateImage(options) {
  const { adapter, config } = getAdapter('imageGen');
  return adapter.generateImage({ ...options, model: config.model });
}

export async function generateEmbedding(options) {
  const { adapter, config } = getAdapter('embedding');
  return adapter.generateEmbedding({ ...options, model: config.model });
}
