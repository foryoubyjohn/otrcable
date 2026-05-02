// ============================================================
// The Child You Raise — Core Type Definitions
// Design: Storybook Realism / Editorial Board Game
// ============================================================

export interface ChildHiddenStats {
  intelligence: number;
  discipline: number;
  emotional_stability: number;
  confidence: number;
  social_skill: number;
  morality: number;
  risk_tolerance: number;
  creativity: number;
  ambition: number;
  resilience: number;
  attachment: number;
  impulsiveness: number;
}

export interface ChildVisibleStats {
  academics: number;
  behavior: number;
  health: number;
  confidence: number;
  social_life: number;
  future_outlook: number;
}

export interface ParentStats {
  stress: number;
  patience: number;
  work_hours: number;
  warmth: number;
  structure: number;
  harshness: number;
  neglect: number;
}

export type ParentingStyle = 'Authoritative' | 'Authoritarian' | 'Permissive' | 'Uninvolved' | 'Inconsistent';

export interface HouseholdStats {
  money: number;
  monthly_income: number;
  monthly_bills: number;
  debt: number;
  housing_quality: number;
  neighborhood_safety: number;
  food_security: number;
  transportation: number;
  family_stability: number;
  time_available: number;
}

export interface SchoolStats {
  quality: number;
  safety: number;
  teacher_support: number;
  college_preparation: number;
  trade_preparation: number;
  peer_quality: number;
  peer_pressure: number;
  social_status: number;
}

export interface RiskFactors {
  crime: number;
  dropout: number;
  substance: number;
  teen_parenthood: number;
  mental_health: number;
  injury: number;
}

export type TraitId = 
  | 'curious' | 'sensitive' | 'independent' | 'defiant' 
  | 'empathetic' | 'competitive' | 'gifted' | 'underachiever'
  | 'easily_distracted' | 'popular' | 'loner' | 'leader'
  | 'follower' | 'rebellious' | 'sneaky' | 'responsible'
  | 'anxious' | 'resilient' | 'street_smart' | 'trouble_magnet';

export interface TraitCounter {
  id: TraitId;
  count: number;
  threshold: number;
  active: boolean;
}

export interface TimelineEntry {
  month: number;
  age: string;
  title: string;
  choice: string;
  result: string;
  traitChanges?: string[];
  isMilestone?: boolean;
}

export type LifePhase = 'Infancy' | 'Toddler' | 'Early Childhood' | 'Elementary' | 'Middle School' | 'High School';

export type SchoolPhase = 'Pre-School' | 'Kindergarten' | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12' | 'N/A';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EndgameOutcome = 
  | 'university' | 'community_college' | 'trade_school' 
  | 'military' | 'workforce' | 'entrepreneurship' 
  | 'crime' | 'incarceration' | 'failure' | 'death';

export interface EndgameResult {
  outcome: EndgameOutcome;
  traits: TraitId[];
  education: string;
  relationship: string;
  financial_readiness: string;
  risk_outcome: string;
  offers: string[];
  narrative: string;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffects;
  result_text: string;
}

export interface EventEffects {
  child_hidden?: Partial<ChildHiddenStats>;
  child_visible?: Partial<ChildVisibleStats>;
  parent?: Partial<ParentStats>;
  household?: Partial<HouseholdStats>;
  school?: Partial<SchoolStats>;
  risks?: Partial<RiskFactors>;
  traits?: Partial<Record<TraitId, number>>;
  money?: number;
  relationship?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  age_min: number;
  age_max: number;
  category: string;
  conditions?: EventCondition[];
  weight: number;
  choices: EventChoice[];
  timeline_text: string;
}

export interface EventCondition {
  type: 'stat' | 'trait' | 'risk' | 'household' | 'school';
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | 'has' | 'not_has';
  value: number | string;
}

export interface GameState {
  // Meta
  version: string;
  created_at: string;
  last_saved: string;
  
  // Game config
  parent_name: string;
  child_name: string;
  difficulty: Difficulty;
  
  // Time
  current_month: number; // 0-indexed, 0 = birth month
  
  // Child
  child_hidden: ChildHiddenStats;
  child_visible: ChildVisibleStats;
  traits: TraitCounter[];
  active_traits: TraitId[];
  
  // Parent
  parent: ParentStats;
  parenting_style: ParentingStyle;
  parenting_history: { warmth: number; structure: number; harshness: number; neglect: number };
  relationship: number; // 0-100
  
  // Household
  household: HouseholdStats;
  
  // School
  school: SchoolStats;
  
  // Risk
  risks: RiskFactors;
  
  // Timeline
  timeline: TimelineEntry[];
  
  // Event tracking
  events_seen: string[];
  current_event: GameEvent | null;
  
  // Game status
  game_over: boolean;
  endgame_result: EndgameResult | null;
}
