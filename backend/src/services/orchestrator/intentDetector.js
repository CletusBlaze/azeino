import { INTENT_TYPES } from '../../config/ai.js';

const SEARCH_SIGNALS = [
  'today', 'latest', 'current', 'right now', 'this week', 'this month', 'this year',
  'news', 'price', 'score', 'weather', 'stock', 'who won', 'what happened',
  'recently', 'just announced', 'breaking', 'update', 'live',
];

const IMAGE_GEN_SIGNALS = [
  'create an image', 'generate an image', 'create a photo', 'draw', 'make an image',
  'create a picture', 'generate a picture', 'create a poster', 'design a',
  'create a logo', 'create a background', 'create a banner',
];

const IMAGE_EDIT_SIGNALS = [
  'remove the background', 'change the background', 'edit this image', 'edit this photo',
  'remove this object', 'improve the lighting', 'make it darker', 'make it brighter',
  'turn this into', 'add gold', 'make this look like', 'crop', 'resize',
];

const CODE_SIGNALS = [
  'code', 'function', 'bug', 'error', 'debug', 'javascript', 'python', 'typescript',
  'react', 'node', 'sql', 'api', 'class', 'variable', 'syntax', 'compile',
  'explain this code', 'fix this', 'refactor', 'convert this',
];

const STUDY_SIGNALS = [
  'answer question', 'past question', 'exam', 'study', 'quiz me', 'test me',
  'explain this topic', 'summarize this lecture', 'flashcard', 'revision',
  'what is the answer to', 'course outline', 'syllabus',
];

const BRAINSTORM_SIGNALS = [
  'brainstorm', 'business idea', 'startup', 'swot', 'business plan', 'pitch',
  'market research', 'validate', 'business model', 'revenue model', 'strategy',
  'competitive analysis', 'target audience', 'go to market', 'mvp', 'product idea',
  'business opportunity', 'entrepreneur', 'monetize', 'scale',
];

function matchesSignals(text, signals) {
  const lower = text.toLowerCase();
  return signals.some((signal) => lower.includes(signal));
}

export function detectIntent({ message, hasImage, hasDocument }) {
  if (hasDocument) return INTENT_TYPES.DOCUMENT;
  if (hasImage) {
    if (matchesSignals(message, IMAGE_EDIT_SIGNALS)) return INTENT_TYPES.IMAGE_EDIT;
    return INTENT_TYPES.VISION;
  }
  // Slash command overrides
  if (message?.startsWith('/image')) return INTENT_TYPES.IMAGE_GEN;
  if (message?.startsWith('/search')) return INTENT_TYPES.SEARCH;
  if (message?.startsWith('/code')) return INTENT_TYPES.CODE;
  if (message?.startsWith('/study')) return INTENT_TYPES.STUDY;
  if (message?.startsWith('/brainstorm')) return INTENT_TYPES.BRAINSTORM;
  if (matchesSignals(message, IMAGE_GEN_SIGNALS)) return INTENT_TYPES.IMAGE_GEN;
  if (matchesSignals(message, IMAGE_EDIT_SIGNALS)) return INTENT_TYPES.IMAGE_EDIT;
  if (matchesSignals(message, CODE_SIGNALS)) return INTENT_TYPES.CODE;
  if (matchesSignals(message, STUDY_SIGNALS)) return INTENT_TYPES.STUDY;
  if (matchesSignals(message, BRAINSTORM_SIGNALS)) return INTENT_TYPES.BRAINSTORM;
  if (matchesSignals(message, SEARCH_SIGNALS)) return INTENT_TYPES.SEARCH;
  return INTENT_TYPES.TEXT;
}
