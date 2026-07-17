import {
  calculate_trick_score,
  calculate_combo_score,
  normalize_to_sls,
  get_best_trick_total,
  calculate_run_score,
  get_consistency_modifier,
  calculate_final_score,
  NORMALIZER
} from '../index';

describe('calculate_trick_score', () => {
  it('should calculate basic trick score correctly', () => {
    const result = calculate_trick_score(7, 1.0, 1.0, 1.0, 1.0, 1.0);
    expect(result).toBe(7);
  });

  it('should apply all modifiers correctly', () => {
    const result = calculate_trick_score(7, 1.1, 1.05, 1.2, 1.1, 1.3);
    const expected = 7 * 1.1 * 1.05 * 1.2 * 1.1 * 1.3;
    expect(result).toBeCloseTo(expected, 5);
  });

  it('should handle minimum modifiers', () => {
    const result = calculate_trick_score(7, 0.8, 0.9, 0.9, 0.7, 1.0);
    const expected = 7 * 0.8 * 0.9 * 0.9 * 0.7 * 1.0;
    expect(result).toBeCloseTo(expected, 5);
  });
});

describe('calculate_combo_score', () => {
  it('should return 0 for empty array', () => {
    expect(calculate_combo_score([])).toBe(0);
  });

  it('should apply 1.2 multiplier for 2 tricks', () => {
    const result = calculate_combo_score([5, 6]);
    expect(result).toBeCloseTo(11 * 1.2, 5);
  });

  it('should apply 1.35 multiplier for 3 tricks', () => {
    const result = calculate_combo_score([5, 6, 7]);
    expect(result).toBeCloseTo(18 * 1.35, 5);
  });

  it('should apply 1.5 multiplier for 4 tricks', () => {
    const result = calculate_combo_score([5, 6, 7, 8]);
    expect(result).toBeCloseTo(26 * 1.5, 5);
  });

  it('should apply 1.7 multiplier for 5+ tricks', () => {
    const result = calculate_combo_score([5, 6, 7, 8, 9]);
    expect(result).toBeCloseTo(35 * 1.7, 5);
  });

  it('should apply 1.7 multiplier for 6 tricks', () => {
    const result = calculate_combo_score([5, 6, 7, 8, 9, 10]);
    expect(result).toBeCloseTo(45 * 1.7, 5);
  });
});

describe('normalize_to_sls', () => {
  it('should normalize basic score', () => {
    const result = normalize_to_sls(30);
    expect(result).toBeCloseTo(30 / NORMALIZER, 5);
  });

  it('should cap at 9.9 for high scores', () => {
    const result = normalize_to_sls(200);
    expect(result).toBe(9.9);
  });

  it('should handle zero score', () => {
    expect(normalize_to_sls(0)).toBe(0);
  });

  it('should return exact value for scores under cap', () => {
    const result = normalize_to_sls(100);
    expect(result).toBeCloseTo(100 / NORMALIZER, 5);
  });
});

describe('get_best_trick_total', () => {
  it('should return 0 for empty array', () => {
    expect(get_best_trick_total([])).toBe(0);
  });

  it('should sum all scores if less than 4', () => {
    expect(get_best_trick_total([5, 6, 7])).toBe(18);
  });

  it('should sum top 4 scores', () => {
    const result = get_best_trick_total([9, 8, 7, 6, 5, 4]);
    expect(result).toBe(30);
  });

  it('should handle exactly 4 scores', () => {
    expect(get_best_trick_total([9, 8, 7, 6])).toBe(30);
  });

  it('should not modify original array', () => {
    const scores = [9, 8, 7, 6, 5];
    get_best_trick_total(scores);
    expect(scores).toEqual([9, 8, 7, 6, 5]);
  });
});

describe('calculate_run_score', () => {
  it('should return 0 for empty array', () => {
    expect(calculate_run_score([], 1.0)).toBe(0);
  });

  it('should calculate average with modifier', () => {
    const result = calculate_run_score([8, 9, 7], 1.2);
    expect(result).toBeCloseTo((24 / 3) * 1.2, 5);
  });

  it('should handle single trick', () => {
    const result = calculate_run_score([8], 1.0);
    expect(result).toBe(8);
  });
});

describe('get_consistency_modifier', () => {
  it('should return 1.2 for 100% landing rate', () => {
    expect(get_consistency_modifier(1.0)).toBe(1.2);
  });

  it('should return 1.2 for >100% landing rate', () => {
    expect(get_consistency_modifier(1.1)).toBe(1.2);
  });

  it('should return 1.0 for 80% landing rate', () => {
    expect(get_consistency_modifier(0.8)).toBe(1.0);
  });

  it('should return 1.0 for 90% landing rate', () => {
    expect(get_consistency_modifier(0.9)).toBe(1.0);
  });

  it('should return 0.8 for 60% landing rate', () => {
    expect(get_consistency_modifier(0.6)).toBe(0.8);
  });

  it('should return 0.8 for 70% landing rate', () => {
    expect(get_consistency_modifier(0.7)).toBe(0.8);
  });

  it('should return 0.6 for 40% landing rate', () => {
    expect(get_consistency_modifier(0.4)).toBe(0.6);
  });

  it('should return 0.6 for <40% landing rate', () => {
    expect(get_consistency_modifier(0.3)).toBe(0.6);
  });
});

describe('calculate_final_score', () => {
  it('should return best trick total when run not used', () => {
    expect(calculate_final_score(30, 6.8, false)).toBe(30);
  });

  it('should return best trick total when run score is null', () => {
    expect(calculate_final_score(30, null, true)).toBe(30);
  });

  it('should calculate weighted score when run used', () => {
    const result = calculate_final_score(30, 6.8, true);
    expect(result).toBeCloseTo((6.8 * 0.4) + (30 * 0.6), 5);
  });

  it('should handle zero run score', () => {
    const result = calculate_final_score(30, 0, true);
    expect(result).toBeCloseTo(30 * 0.6, 5);
  });
});
