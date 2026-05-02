// ============================================================
// Game State Engine — Creates and manages the core game state
// ============================================================

import type { GameState, Difficulty, ChildHiddenStats, ChildVisibleStats, ParentStats, HouseholdStats, SchoolStats, RiskFactors, TraitCounter, TraitId, LifePhase, SchoolPhase } from './types';

const ALL_TRAITS: TraitId[] = [
  'curious', 'sensitive', 'independent', 'defiant', 'empathetic',
  'competitive', 'gifted', 'underachiever', 'easily_distracted',
  'popular', 'loner', 'leader', 'follower', 'rebellious',
  'sneaky', 'responsible', 'anxious', 'resilient', 'street_smart', 'trouble_magnet'
];

const TRAIT_THRESHOLDS: Record<TraitId, number> = {
  curious: 5, sensitive: 4, independent: 5, defiant: 5, empathetic: 5,
  competitive: 5, gifted: 7, underachiever: 5, easily_distracted: 4,
  popular: 5, loner: 4, leader: 6, follower: 4, rebellious: 5,
  sneaky: 5, responsible: 5, anxious: 4, resilient: 6, street_smart: 5, trouble_magnet: 4
};

function createInitialHiddenStats(difficulty: Difficulty): ChildHiddenStats {
  const base = difficulty === 'easy' ? 55 : difficulty === 'normal' ? 50 : 45;
  return {
    intelligence: base,
    discipline: base,
    emotional_stability: base,
    confidence: base,
    social_skill: base,
    morality: base + 5,
    risk_tolerance: 50,
    creativity: base,
    ambition: base,
    resilience: base,
    attachment: base + 10,
    impulsiveness: 50,
  };
}

function createInitialVisibleStats(): ChildVisibleStats {
  return {
    academics: 50,
    behavior: 60,
    health: 70,
    confidence: 50,
    social_life: 50,
    future_outlook: 50,
  };
}

function createInitialParentStats(difficulty: Difficulty): ParentStats {
  const stressBase = difficulty === 'easy' ? 20 : difficulty === 'normal' ? 30 : 40;
  return {
    stress: stressBase,
    patience: 60,
    work_hours: 40,
    warmth: 60,
    structure: 50,
    harshness: 10,
    neglect: 5,
  };
}

function createInitialHousehold(difficulty: Difficulty): HouseholdStats {
  const moneyBase = difficulty === 'easy' ? 5000 : difficulty === 'normal' ? 3000 : 1500;
  const incomeBase = difficulty === 'easy' ? 4500 : difficulty === 'normal' ? 3500 : 2500;
  const billsBase = difficulty === 'easy' ? 2800 : difficulty === 'normal' ? 3000 : 2800;
  return {
    money: moneyBase,
    monthly_income: incomeBase,
    monthly_bills: billsBase,
    debt: difficulty === 'hard' ? 15000 : difficulty === 'normal' ? 5000 : 0,
    housing_quality: difficulty === 'easy' ? 70 : difficulty === 'normal' ? 55 : 40,
    neighborhood_safety: difficulty === 'easy' ? 75 : difficulty === 'normal' ? 60 : 40,
    food_security: difficulty === 'easy' ? 90 : difficulty === 'normal' ? 75 : 55,
    transportation: difficulty === 'easy' ? 80 : difficulty === 'normal' ? 60 : 40,
    family_stability: difficulty === 'easy' ? 80 : difficulty === 'normal' ? 65 : 45,
    time_available: difficulty === 'easy' ? 70 : difficulty === 'normal' ? 55 : 40,
  };
}

function createInitialSchool(): SchoolStats {
  return {
    quality: 50,
    safety: 60,
    teacher_support: 50,
    college_preparation: 30,
    trade_preparation: 30,
    peer_quality: 50,
    peer_pressure: 30,
    social_status: 50,
  };
}

function createInitialRisks(): RiskFactors {
  return {
    crime: 5,
    dropout: 5,
    substance: 5,
    teen_parenthood: 5,
    mental_health: 10,
    injury: 10,
  };
}

function createTraitCounters(): TraitCounter[] {
  return ALL_TRAITS.map(id => ({
    id,
    count: 0,
    threshold: TRAIT_THRESHOLDS[id],
    active: false,
  }));
}

export function createNewGame(parentName: string, childName: string, difficulty: Difficulty): GameState {
  return {
    version: '1.0.0',
    created_at: new Date().toISOString(),
    last_saved: new Date().toISOString(),
    parent_name: parentName,
    child_name: childName,
    difficulty,
    current_month: 0,
    child_hidden: createInitialHiddenStats(difficulty),
    child_visible: createInitialVisibleStats(),
    traits: createTraitCounters(),
    active_traits: [],
    parent: createInitialParentStats(difficulty),
    parenting_style: 'Authoritative',
    parenting_history: { warmth: 0, structure: 0, harshness: 0, neglect: 0 },
    relationship: 70,
    household: createInitialHousehold(difficulty),
    school: createInitialSchool(),
    risks: createInitialRisks(),
    timeline: [],
    events_seen: [],
    current_event: null,
    game_over: false,
    endgame_result: null,
  };
}

export function getAgeFromMonth(month: number): { years: number; months: number } {
  return {
    years: Math.floor(month / 12),
    months: month % 12,
  };
}

export function getAgeString(month: number): string {
  const { years, months } = getAgeFromMonth(month);
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
}

export function getLifePhase(month: number): LifePhase {
  const years = Math.floor(month / 12);
  if (years < 1) return 'Infancy';
  if (years < 3) return 'Toddler';
  if (years < 5) return 'Early Childhood';
  if (years < 11) return 'Elementary';
  if (years < 14) return 'Middle School';
  return 'High School';
}

export function getSchoolPhase(month: number): SchoolPhase {
  const years = Math.floor(month / 12);
  if (years < 3) return 'N/A';
  if (years < 5) return 'Pre-School';
  if (years < 6) return 'Kindergarten';
  if (years < 7) return 'Grade 1';
  if (years < 8) return 'Grade 2';
  if (years < 9) return 'Grade 3';
  if (years < 10) return 'Grade 4';
  if (years < 11) return 'Grade 5';
  if (years < 12) return 'Grade 6';
  if (years < 13) return 'Grade 7';
  if (years < 14) return 'Grade 8';
  if (years < 15) return 'Grade 9';
  if (years < 16) return 'Grade 10';
  if (years < 17) return 'Grade 11';
  return 'Grade 12';
}

export function clampStat(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
