// ============================================================
// Trait Engine — Evaluates and activates traits based on stats
// ============================================================

import type { GameState, TraitId } from './types';

interface TraitCondition {
  id: TraitId;
  label: string;
  description: string;
  icon: string;
  evaluate: (state: GameState) => boolean;
}

export const TRAIT_DEFINITIONS: TraitCondition[] = [
  {
    id: 'curious',
    label: 'Curious',
    description: 'Always asking questions and exploring new things',
    icon: '🔍',
    evaluate: (s) => s.child_hidden.intelligence > 60 && s.child_hidden.creativity > 55,
  },
  {
    id: 'sensitive',
    label: 'Sensitive',
    description: 'Deeply affected by emotions and environment',
    icon: '💧',
    evaluate: (s) => s.child_hidden.emotional_stability < 40 && s.child_hidden.attachment > 50,
  },
  {
    id: 'independent',
    label: 'Independent',
    description: 'Prefers to figure things out alone',
    icon: '🦅',
    evaluate: (s) => s.child_hidden.confidence > 60 && s.child_hidden.attachment < 50,
  },
  {
    id: 'defiant',
    label: 'Defiant',
    description: 'Challenges authority and pushes boundaries',
    icon: '⚡',
    evaluate: (s) => s.child_hidden.discipline < 35 && s.child_hidden.impulsiveness > 60,
  },
  {
    id: 'empathetic',
    label: 'Empathetic',
    description: 'Naturally understands and cares about others\' feelings',
    icon: '❤️',
    evaluate: (s) => s.child_hidden.morality > 65 && s.child_hidden.social_skill > 55,
  },
  {
    id: 'competitive',
    label: 'Competitive',
    description: 'Driven to win and be the best',
    icon: '🏆',
    evaluate: (s) => s.child_hidden.ambition > 65 && s.child_hidden.confidence > 55,
  },
  {
    id: 'gifted',
    label: 'Gifted',
    description: 'Exceptional natural intelligence',
    icon: '✨',
    evaluate: (s) => s.child_hidden.intelligence > 80 && s.child_visible.academics > 75,
  },
  {
    id: 'underachiever',
    label: 'Underachiever',
    description: 'Has potential but doesn\'t apply it',
    icon: '📉',
    evaluate: (s) => s.child_hidden.intelligence > 60 && s.child_visible.academics < 40 && s.child_hidden.discipline < 40,
  },
  {
    id: 'easily_distracted',
    label: 'Easily Distracted',
    description: 'Struggles to maintain focus',
    icon: '🦋',
    evaluate: (s) => s.child_hidden.discipline < 35 && s.child_hidden.impulsiveness > 55,
  },
  {
    id: 'popular',
    label: 'Popular',
    description: 'Well-liked and socially influential',
    icon: '⭐',
    evaluate: (s) => s.child_hidden.social_skill > 70 && s.school.social_status > 65,
  },
  {
    id: 'loner',
    label: 'Loner',
    description: 'Prefers solitude over social interaction',
    icon: '🌙',
    evaluate: (s) => s.child_hidden.social_skill < 35 && s.child_visible.social_life < 35,
  },
  {
    id: 'leader',
    label: 'Leader',
    description: 'Naturally takes charge in group situations',
    icon: '👑',
    evaluate: (s) => s.child_hidden.confidence > 70 && s.child_hidden.social_skill > 60 && s.child_hidden.ambition > 60,
  },
  {
    id: 'follower',
    label: 'Follower',
    description: 'Tends to go along with the group',
    icon: '🐑',
    evaluate: (s) => s.child_hidden.confidence < 40 && s.school.peer_pressure > 50,
  },
  {
    id: 'rebellious',
    label: 'Rebellious',
    description: 'Actively resists rules and expectations',
    icon: '🔥',
    evaluate: (s) => s.child_hidden.discipline < 30 && s.child_hidden.risk_tolerance > 65 && s.relationship < 40,
  },
  {
    id: 'sneaky',
    label: 'Sneaky',
    description: 'Hides behavior and avoids getting caught',
    icon: '🦊',
    evaluate: (s) => s.child_hidden.intelligence > 50 && s.child_hidden.morality < 40 && s.child_hidden.discipline < 45,
  },
  {
    id: 'responsible',
    label: 'Responsible',
    description: 'Reliable and takes obligations seriously',
    icon: '🎯',
    evaluate: (s) => s.child_hidden.discipline > 65 && s.child_hidden.morality > 60,
  },
  {
    id: 'anxious',
    label: 'Anxious',
    description: 'Frequently worried and stressed',
    icon: '😰',
    evaluate: (s) => s.child_hidden.emotional_stability < 35 && s.child_hidden.confidence < 40,
  },
  {
    id: 'resilient',
    label: 'Resilient',
    description: 'Bounces back from setbacks quickly',
    icon: '💪',
    evaluate: (s) => s.child_hidden.resilience > 70 && s.child_hidden.emotional_stability > 55,
  },
  {
    id: 'street_smart',
    label: 'Street Smart',
    description: 'Knows how to navigate difficult situations',
    icon: '🧠',
    evaluate: (s) => s.child_hidden.risk_tolerance > 55 && s.child_hidden.intelligence > 50 && s.household.neighborhood_safety < 45,
  },
  {
    id: 'trouble_magnet',
    label: 'Trouble Magnet',
    description: 'Seems to attract problems and risky situations',
    icon: '⚠️',
    evaluate: (s) => s.child_hidden.impulsiveness > 65 && s.child_hidden.risk_tolerance > 60 && s.risks.crime > 30,
  },
];

export function evaluateTraits(state: GameState): GameState {
  const newState = structuredClone(state);

  for (const def of TRAIT_DEFINITIONS) {
    const trait = newState.traits.find(t => t.id === def.id);
    if (!trait) continue;

    // Stat-based evaluation can activate traits even without event counters
    const statConditionMet = def.evaluate(newState);
    
    if (statConditionMet && trait.count >= Math.floor(trait.threshold * 0.5)) {
      if (!trait.active) {
        trait.active = true;
        if (!newState.active_traits.includes(def.id)) {
          newState.active_traits.push(def.id);
        }
      }
    } else if (!statConditionMet && trait.count < trait.threshold) {
      // Can lose traits if conditions no longer met and counter is low
      if (trait.active && trait.count < Math.floor(trait.threshold * 0.3)) {
        trait.active = false;
        newState.active_traits = newState.active_traits.filter(t => t !== def.id);
      }
    }
  }

  return newState;
}

export function getTraitLabel(id: TraitId): string {
  return TRAIT_DEFINITIONS.find(t => t.id === id)?.label || id;
}

export function getTraitDescription(id: TraitId): string {
  return TRAIT_DEFINITIONS.find(t => t.id === id)?.description || '';
}

export function getTraitIcon(id: TraitId): string {
  return TRAIT_DEFINITIONS.find(t => t.id === id)?.icon || '❓';
}
