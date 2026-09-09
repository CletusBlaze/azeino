import { detectIntent } from './intentDetector.js';
import { INTENT_TYPES } from '../../config/ai.js';
import * as textPipeline from '../pipelines/textPipeline.js';
import * as searchPipeline from '../pipelines/searchPipeline.js';
import * as visionPipeline from '../pipelines/visionPipeline.js';
import * as documentPipeline from '../pipelines/documentPipeline.js';
import * as imageGenPipeline from '../pipelines/imageGenPipeline.js';
import * as imageEditPipeline from '../pipelines/imageEditPipeline.js';
import * as codePipeline from '../pipelines/codePipeline.js';
import * as studyPipeline from '../pipelines/studyPipeline.js';
import * as brainstormPipeline from '../pipelines/brainstormPipeline.js';

const pipelines = {
  [INTENT_TYPES.TEXT]: textPipeline,
  [INTENT_TYPES.SEARCH]: searchPipeline,
  [INTENT_TYPES.VISION]: visionPipeline,
  [INTENT_TYPES.DOCUMENT]: documentPipeline,
  [INTENT_TYPES.IMAGE_GEN]: imageGenPipeline,
  [INTENT_TYPES.IMAGE_EDIT]: imageEditPipeline,
  [INTENT_TYPES.CODE]: codePipeline,
  [INTENT_TYPES.STUDY]: studyPipeline,
  [INTENT_TYPES.BRAINSTORM]: brainstormPipeline,
};

export async function orchestrate({ message, history = [], file, contextHint, memoryContext = '', personalization = '' }) {
  const hasImage = file?.type?.startsWith('image/');
  const hasDocument = file && !hasImage;

  const intent = contextHint || detectIntent({ message, hasImage, hasDocument });
  const pipeline = pipelines[intent] || textPipeline;
  const result = await pipeline.run({ message, history, file, intent, memoryContext, personalization });
  return { ...result, intent };
}
