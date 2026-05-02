// ============================================================
// Stat Engine — Applies effects, processes monthly updates
// ============================================================

import type { GameState, EventEffects, EventChoice } from './types';
import { clampStat } from './gameState';

export function applyEffects(state: GameState, effects: EventEffects): GameState {
  const newState = structuredClone(state);

  // Apply child hidden stat changes
  if (effects.child_hidden) {
    for (const [key, value] of Object.entries(effects.child_hidden)) {
      const k = key as keyof typeof newState.child_hidden;
      newState.child_hidden[k] = clampStat(newState.child_hidden[k] + (value as number));
    }
  }

  // Apply child visible stat changes
  if (effects.child_visible) {
    for (const [key, value] of Object.entries(effects.child_visible)) {
      const k = key as keyof typeof newState.child_visible;
      newState.child_visible[k] = clampStat(newState.child_visible[k] + (value as number));
    }
  }

  // Apply parent stat changes
  if (effects.parent) {
    for (const [key, value] of Object.entries(effects.parent)) {
      const k = key as keyof typeof newState.parent;
      newState.parent[k] = clampStat(newState.parent[k] + (value as number));
    }
  }

  // Apply household stat changes
  if (effects.household) {
    for (const [key, value] of Object.entries(effects.household)) {
      const k = key as keyof typeof newState.household;
      if (k === 'money' || k === 'monthly_income' || k === 'monthly_bills' || k === 'debt') {
        newState.household[k] = Math.max(0, newState.household[k] + (value as number));
      } else {
        newState.household[k] = clampStat(newState.household[k] + (value as number));
      }
    }
  }

  // Apply school stat changes
  if (effects.school) {
    for (const [key, value] of Object.entries(effects.school)) {
      const k = key as keyof typeof newState.school;
      newState.school[k] = clampStat(newState.school[k] + (value as number));
    }
  }

  // Apply risk changes
  if (effects.risks) {
    for (const [key, value] of Object.entries(effects.risks)) {
      const k = key as keyof typeof newState.risks;
      newState.risks[k] = clampStat(newState.risks[k] + (value as number));
    }
  }

  // Apply trait counter changes
  if (effects.traits) {
    for (const [traitId, value] of Object.entries(effects.traits)) {
      const trait = newState.traits.find(t => t.id === traitId);
      if (trait) {
        trait.count += value as number;
        if (trait.count >= trait.threshold && !trait.active) {
          trait.active = true;
          if (!newState.active_traits.includes(trait.id)) {
            newState.active_traits.push(trait.id);
          }
        }
      }
    }
  }

  // Apply money changes
  if (effects.money) {
    newState.household.money = Math.max(0, newState.household.money + effects.money);
  }

  // Apply relationship changes
  if (effects.relationship) {
    newState.relationship = clampStat(newState.relationship + effects.relationship);
  }

  return newState;
}

export function processMonthlyUpdate(state: GameState): GameState {
  const newState = structuredClone(state);

  // Monthly income/bills
  const netIncome = newState.household.monthly_income - newState.household.monthly_bills;
  newState.household.money = Math.max(0, newState.household.money + netIncome);

  // Debt interest (simplified)
  if (newState.household.debt > 0) {
    newState.household.debt = Math.round(newState.household.debt * 1.005); // 0.5% monthly
    newState.household.money = Math.max(0, newState.household.money - Math.round(newState.household.debt * 0.02));
  }

  // Stress recovery/accumulation
  if (newState.parent.stress > 50) {
    newState.parent.patience = clampStat(newState.parent.patience - 1);
  } else if (newState.parent.stress < 30) {
    newState.parent.patience = clampStat(newState.parent.patience + 1);
  }

  // Financial stress
  if (newState.household.money < 500) {
    newState.parent.stress = clampStat(newState.parent.stress + 3);
    newState.household.food_security = clampStat(newState.household.food_security - 2);
  }

  // Natural stat drift based on environment
  const years = Math.floor(newState.current_month / 12);
  
  // Child development based on environment
  if (newState.household.food_security < 40) {
    newState.child_visible.health = clampStat(newState.child_visible.health - 1);
  }
  
  if (newState.relationship > 70) {
    newState.child_hidden.attachment = clampStat(newState.child_hidden.attachment + 0.5);
    newState.child_hidden.emotional_stability = clampStat(newState.child_hidden.emotional_stability + 0.3);
  } else if (newState.relationship < 30) {
    newState.child_hidden.attachment = clampStat(newState.child_hidden.attachment - 0.5);
    newState.child_hidden.emotional_stability = clampStat(newState.child_hidden.emotional_stability - 0.3);
  }

  // School influence (only when in school)
  if (years >= 5) {
    if (newState.school.quality > 60) {
      newState.child_hidden.intelligence = clampStat(newState.child_hidden.intelligence + 0.2);
      newState.child_visible.academics = clampStat(newState.child_visible.academics + 0.3);
    }
    if (newState.school.peer_pressure > 60) {
      newState.child_hidden.risk_tolerance = clampStat(newState.child_hidden.risk_tolerance + 0.3);
    }
  }

  // Update visible stats based on hidden stats
  newState.child_visible.academics = clampStat(
    newState.child_visible.academics * 0.95 + 
    (newState.child_hidden.intelligence * 0.3 + newState.child_hidden.discipline * 0.2) * 0.05
  );
  newState.child_visible.behavior = clampStat(
    newState.child_visible.behavior * 0.95 +
    (newState.child_hidden.discipline * 0.3 + newState.child_hidden.morality * 0.2 + (100 - newState.child_hidden.impulsiveness) * 0.1) * 0.05
  );
  newState.child_visible.confidence = clampStat(
    newState.child_visible.confidence * 0.95 +
    newState.child_hidden.confidence * 0.05
  );
  newState.child_visible.social_life = clampStat(
    newState.child_visible.social_life * 0.95 +
    newState.child_hidden.social_skill * 0.05
  );

  // Update parenting style based on history
  newState.parenting_style = calculateParentingStyle(newState);

  return newState;
}

function calculateParentingStyle(state: GameState): typeof state.parenting_style {
  const { warmth, structure, harshness, neglect } = state.parenting_history;
  const total = warmth + structure + harshness + neglect;
  
  if (total < 5) return 'Authoritative'; // Default early game
  
  const warmthRatio = warmth / total;
  const structureRatio = structure / total;
  const harshnessRatio = harshness / total;
  const neglectRatio = neglect / total;

  if (neglectRatio > 0.4) return 'Uninvolved';
  if (harshnessRatio > 0.35 && structureRatio > 0.25) return 'Authoritarian';
  if (warmthRatio > 0.35 && structureRatio > 0.25) return 'Authoritative';
  if (warmthRatio > 0.4 && structureRatio < 0.15) return 'Permissive';
  
  // Check for inconsistency
  const max = Math.max(warmthRatio, structureRatio, harshnessRatio, neglectRatio);
  if (max < 0.35) return 'Inconsistent';
  
  return 'Authoritative';
}

export function applyChoice(state: GameState, choice: EventChoice): GameState {
  let newState = applyEffects(state, choice.effects);

  // Track parenting style indicators
  const effects = choice.effects;
  if (effects.parent) {
    if (effects.parent.warmth && effects.parent.warmth > 0) {
      newState.parenting_history.warmth += 1;
    }
    if (effects.parent.structure && effects.parent.structure > 0) {
      newState.parenting_history.structure += 1;
    }
    if (effects.parent.harshness && effects.parent.harshness > 0) {
      newState.parenting_history.harshness += 1;
    }
    if (effects.parent.neglect && effects.parent.neglect > 0) {
      newState.parenting_history.neglect += 1;
    }
  }

  // Infer parenting style from relationship and other effects
  if (effects.relationship) {
    if (effects.relationship > 0) newState.parenting_history.warmth += 0.5;
    if (effects.relationship < -3) newState.parenting_history.harshness += 0.5;
  }

  return newState;
}
