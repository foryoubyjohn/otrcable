// ============================================================
// Risk Engine — Calculates and updates risk factors
// ============================================================

import type { GameState } from './types';
import { clampStat } from './gameState';

export function updateRisks(state: GameState): GameState {
  const newState = structuredClone(state);
  const years = Math.floor(state.current_month / 12);

  // Crime risk factors
  let crimeDelta = 0;
  if (newState.household.neighborhood_safety < 40) crimeDelta += 0.5;
  if (newState.child_hidden.morality < 35) crimeDelta += 0.5;
  if (newState.child_hidden.discipline < 30) crimeDelta += 0.3;
  if (newState.school.peer_quality < 35) crimeDelta += 0.3;
  if (newState.relationship < 30) crimeDelta += 0.4;
  if (newState.child_hidden.morality > 65) crimeDelta -= 0.5;
  if (newState.household.neighborhood_safety > 70) crimeDelta -= 0.3;
  if (newState.relationship > 70) crimeDelta -= 0.3;
  newState.risks.crime = clampStat(newState.risks.crime + crimeDelta);

  // Dropout risk
  let dropoutDelta = 0;
  if (newState.child_visible.academics < 30) dropoutDelta += 0.5;
  if (newState.child_hidden.ambition < 30) dropoutDelta += 0.3;
  if (newState.school.quality < 35) dropoutDelta += 0.3;
  if (newState.household.money < 500) dropoutDelta += 0.4;
  if (newState.child_visible.academics > 60) dropoutDelta -= 0.4;
  if (newState.child_hidden.ambition > 60) dropoutDelta -= 0.3;
  if (newState.parent.structure > 60) dropoutDelta -= 0.2;
  newState.risks.dropout = clampStat(newState.risks.dropout + dropoutDelta);

  // Substance risk (increases with age)
  let substanceDelta = 0;
  if (years >= 12) {
    if (newState.school.peer_pressure > 60) substanceDelta += 0.4;
    if (newState.child_hidden.risk_tolerance > 65) substanceDelta += 0.3;
    if (newState.child_hidden.emotional_stability < 35) substanceDelta += 0.3;
    if (newState.parent.stress > 70) substanceDelta += 0.2;
    if (newState.relationship < 35) substanceDelta += 0.3;
    if (newState.child_hidden.discipline > 60) substanceDelta -= 0.3;
    if (newState.relationship > 65) substanceDelta -= 0.3;
    if (newState.child_hidden.morality > 60) substanceDelta -= 0.2;
  }
  newState.risks.substance = clampStat(newState.risks.substance + substanceDelta);

  // Teen parenthood risk
  let teenParentDelta = 0;
  if (years >= 13) {
    if (newState.child_hidden.impulsiveness > 65) teenParentDelta += 0.3;
    if (newState.child_hidden.risk_tolerance > 60) teenParentDelta += 0.2;
    if (newState.school.peer_pressure > 60) teenParentDelta += 0.2;
    if (newState.parent.structure < 30) teenParentDelta += 0.3;
    if (newState.child_hidden.discipline > 60) teenParentDelta -= 0.3;
    if (newState.parent.structure > 60) teenParentDelta -= 0.2;
  }
  newState.risks.teen_parenthood = clampStat(newState.risks.teen_parenthood + teenParentDelta);

  // Mental health risk
  let mentalDelta = 0;
  if (newState.child_hidden.emotional_stability < 35) mentalDelta += 0.4;
  if (newState.parent.stress > 70) mentalDelta += 0.2;
  if (newState.relationship < 30) mentalDelta += 0.4;
  if (newState.household.family_stability < 35) mentalDelta += 0.3;
  if (newState.child_hidden.resilience < 30) mentalDelta += 0.3;
  if (newState.child_hidden.emotional_stability > 65) mentalDelta -= 0.4;
  if (newState.relationship > 70) mentalDelta -= 0.3;
  if (newState.child_hidden.resilience > 65) mentalDelta -= 0.3;
  newState.risks.mental_health = clampStat(newState.risks.mental_health + mentalDelta);

  // Injury risk
  let injuryDelta = 0;
  if (newState.child_hidden.impulsiveness > 65) injuryDelta += 0.3;
  if (newState.child_hidden.risk_tolerance > 70) injuryDelta += 0.3;
  if (newState.household.neighborhood_safety < 35) injuryDelta += 0.3;
  if (years < 5) injuryDelta += 0.2; // Young children more accident-prone
  if (newState.child_hidden.discipline > 60) injuryDelta -= 0.2;
  if (newState.household.neighborhood_safety > 70) injuryDelta -= 0.2;
  newState.risks.injury = clampStat(newState.risks.injury + injuryDelta);

  return newState;
}

export function getRiskLevel(value: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (value < 20) return 'low';
  if (value < 40) return 'moderate';
  if (value < 65) return 'high';
  return 'critical';
}

export function getActiveWarnings(state: GameState): string[] {
  const warnings: string[] = [];
  
  if (state.risks.crime > 40) warnings.push('Criminal influence risk');
  if (state.risks.dropout > 40) warnings.push('School dropout risk');
  if (state.risks.substance > 35) warnings.push('Substance exposure risk');
  if (state.risks.teen_parenthood > 35) warnings.push('Teen parenthood risk');
  if (state.risks.mental_health > 40) warnings.push('Mental health concern');
  if (state.risks.injury > 40) warnings.push('Injury risk elevated');
  if (state.household.money < 300) warnings.push('Financial crisis');
  if (state.parent.stress > 80) warnings.push('Parent burnout');
  if (state.relationship < 25) warnings.push('Relationship breakdown');
  if (state.child_visible.health < 30) warnings.push('Health concern');

  return warnings;
}
