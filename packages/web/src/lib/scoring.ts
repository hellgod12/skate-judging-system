export interface TrickModifiers {
  execution: number;
  style: number;
  amplitude: number;
  landing: number;
  risk: number;
}

export interface Trick {
  name: string;
  modifiers: TrickModifiers;
}

export interface SingleAttempt {
  type: 'single';
  trick: string;
  modifiers: TrickModifiers;
}

export interface ComboAttempt {
  type: 'combo';
  tricks: Trick[];
}

export type Attempt = SingleAttempt | ComboAttempt;

export const NORMALIZER = 15;

export function calculate_trick_score(
  difficulty: number,
  execution: number,
  style: number,
  amplitude: number,
  landing: number,
  risk: number
): number {
  return difficulty * execution * style * amplitude * landing * risk;
}

export function calculate_combo_score(trickScores: number[]): number {
  if (trickScores.length === 0) return 0;
  
  const sum = trickScores.reduce((acc, score) => acc + score, 0);
  
  let multiplier: number;
  switch (trickScores.length) {
    case 2:
      multiplier = 1.2;
      break;
    case 3:
      multiplier = 1.35;
      break;
    case 4:
      multiplier = 1.5;
      break;
    default:
      multiplier = trickScores.length >= 5 ? 1.7 : 1.0;
  }
  
  return sum * multiplier;
}

export function normalize_to_sls(rawScore: number): number {
  return Math.min(rawScore / NORMALIZER, 9.9);
}

export function get_best_trick_total(scores: number[]): number {
  if (scores.length === 0) return 0;
  
  const sortedScores = [...scores].sort((a, b) => b - a);
  const top4 = sortedScores.slice(0, 4);
  
  return top4.reduce((acc, score) => acc + score, 0);
}

export function calculate_run_score(
  trickScores: number[],
  consistencyModifier: number
): number {
  if (trickScores.length === 0) return 0;
  
  const total = trickScores.reduce((acc, score) => acc + score, 0);
  return (total / trickScores.length) * consistencyModifier;
}

export function get_consistency_modifier(landingRate: number): number {
  if (landingRate >= 1.0) return 1.2;
  if (landingRate >= 0.8) return 1.0;
  if (landingRate >= 0.6) return 0.8;
  return 0.6;
}

export function calculate_final_score(
  bestTrickTotal: number,
  runScore: number | null,
  useRun: boolean
): number {
  if (!useRun || runScore === null) {
    return bestTrickTotal;
  }
  
  return (runScore * 0.4) + (bestTrickTotal * 0.6);
}
