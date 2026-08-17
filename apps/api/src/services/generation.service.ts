import { AppError } from '../utils/AppError';
import { findCardById } from '../models/card.model';
import { createRun } from '../models/run.model';
import { generateText } from './ai/generateText';
import { generateImage } from './ai/generateImage';
import { uploadGeneratedImage } from './storage.service';
import { CardRun, PromptCard, PromptVariable, ResultType } from '../types';

/** Replaces {{key}} placeholders in prompt_body with the caller's supplied values,
 * falling back to each variable's `default` when no value was supplied. */
function fillTemplate(promptBody: string, variables: PromptVariable[], values: Record<string, string>): string {
  let filled = promptBody;
  for (const variable of variables) {
    const value = values[variable.key] ?? variable.default ?? '';
    const pattern = new RegExp(`{{\\s*${variable.key}\\s*}}`, 'g');
    filled = filled.replace(pattern, value);
  }
  return filled;
}

/** A card is runnable by anyone who owns it, or anyone at all if it's public
 * (mirrors the read-access rule enforced by RLS at the DB level — PRD Section 8). */
function assertRunAccess(card: PromptCard, userId: string) {
  if (card.owner_id !== userId && !card.is_public) {
    throw AppError.forbidden('You do not have access to run this card');
  }
  if (card.mode !== 'run_in_app') {
    throw AppError.badRequest('This card is save-only and cannot be run in-app');
  }
}

/**
 * PRD Section 9 — the end-to-end "run a card" flow:
 * fetch card -> fill variables -> call the right AI provider -> persist
 * a card_runs row -> return the result to the client.
 */
export async function runCard(
  cardId: string,
  userId: string,
  values: Record<string, string>
): Promise<CardRun> {
  const card = await findCardById(cardId);
  if (!card) throw AppError.notFound('Card not found');

  assertRunAccess(card, userId);

  const filledPrompt = fillTemplate(card.prompt_body, card.variables ?? [], values);

  let resultType: ResultType;
  let resultValue: string;

  if (card.type === 'image') {
    const imageBuffer = await generateImage(filledPrompt);
    resultValue = await uploadGeneratedImage(imageBuffer);
    resultType = 'image_url';
  } else if (card.type === 'video') {
    // v1 generates the video PROMPT/SCRIPT only — no rendering (PRD Section 3.5)
    const scriptPrompt = `Write a short video script/shot list for the following idea. Be concise and production-ready:\n\n${filledPrompt}`;
    resultValue = await generateText(scriptPrompt);
    resultType = 'video_script';
  } else {
    resultValue = await generateText(filledPrompt);
    resultType = 'text';
  }

  return createRun({
    cardId: card.id,
    userId,
    filledPrompt,
    resultType,
    resultValue,
  });
}
