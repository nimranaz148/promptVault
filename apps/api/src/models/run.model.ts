import { supabaseAdmin } from '../config/supabase';
import { CardRun, ResultType } from '../types';

export async function createRun(input: {
  cardId: string;
  userId: string;
  filledPrompt: string;
  resultType: ResultType;
  resultValue: string;
}): Promise<CardRun> {
  const { data, error } = await supabaseAdmin
    .from('card_runs')
    .insert({
      card_id: input.cardId,
      user_id: input.userId,
      filled_prompt: input.filledPrompt,
      result_type: input.resultType,
      result_value: input.resultValue,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}
