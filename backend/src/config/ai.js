export const AI_PROVIDERS = {
  text: {
    primary: 'gemini',
    model: 'gemini-3.6-flash',
    fallback: 'gemini',
    fallbackModel: 'gemini-3.6-flash',
  },
  search: {
    primary: 'gemini',
    model: 'gemini-3.6-flash',
    fallback: 'gemini',
    fallbackModel: 'gemini-3.6-flash',
  },
  vision: {
    primary: 'gemini',
    model: 'gemini-3.6-flash',
    fallback: 'gemini',
    fallbackModel: 'gemini-3.6-flash',
  },
  document: {
    primary: 'gemini',
    model: 'gemini-3.6-flash',
    fallback: 'gemini',
    fallbackModel: 'gemini-3.6-flash',
  },
  imageGen: {
    primary: 'openai',
    model: 'gpt-image-1',
  },
  imageEdit: {
    primary: 'openai',
    model: 'gpt-image-1',
  },
  embedding: {
    primary: 'gemini',
    model: 'gemini-3.6-flash',
  },
};

export const INTENT_TYPES = {
  TEXT: 'text',
  SEARCH: 'search',
  VISION: 'vision',
  DOCUMENT: 'document',
  IMAGE_GEN: 'imageGen',
  IMAGE_EDIT: 'imageEdit',
  CODE: 'code',
  STUDY: 'study',
  BRAINSTORM: 'brainstorm',
};
