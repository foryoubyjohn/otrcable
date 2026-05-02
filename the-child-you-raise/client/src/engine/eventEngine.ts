// ============================================================
// Event Engine — Selects events based on age, conditions, weights
// ============================================================

import type { GameState, GameEvent, EventCondition } from './types';

// Import all event data
import infancyEvents from '../data/events/infancy.json';
import elementaryEvents from '../data/events/elementary.json';
import middleSchoolEvents from '../data/events/middleSchool.json';
import highSchoolEvents from '../data/events/highSchool.json';

const ALL_EVENTS: GameEvent[] = [
  ...infancyEvents as GameEvent[],
  ...elementaryEvents as GameEvent[],
  ...middleSchoolEvents as GameEvent[],
  ...highSchoolEvents as GameEvent[],
];

function checkCondition(state: GameState, condition: EventCondition): boolean {
  let fieldValue: number | string | boolean;

  switch (condition.type) {
    case 'stat':
      fieldValue = (state.child_hidden as any)[condition.field] ?? 
                   (state.child_visible as any)[condition.field] ?? 0;
      break;
    case 'trait':
      if (condition.operator === 'has') {
        return state.active_traits.includes(condition.field as any);
      }
      if (condition.operator === 'not_has') {
        return !state.active_traits.includes(condition.field as any);
      }
      return false;
    case 'risk':
      fieldValue = (state.risks as any)[condition.field] ?? 0;
      break;
    case 'household':
      fieldValue = (state.household as any)[condition.field] ?? 0;
      break;
    case 'school':
      fieldValue = (state.school as any)[condition.field] ?? 0;
      break;
    default:
      return true;
  }

  const numValue = typeof fieldValue === 'number' ? fieldValue : 0;
  const condValue = typeof condition.value === 'number' ? condition.value : 0;

  switch (condition.operator) {
    case '>': return numValue > condValue;
    case '<': return numValue < condValue;
    case '>=': return numValue >= condValue;
    case '<=': return numValue <= condValue;
    case '==': return numValue === condValue;
    default: return true;
  }
}

function getEligibleEvents(state: GameState): GameEvent[] {
  const ageInMonths = state.current_month;
  const ageInYears = ageInMonths / 12;

  return ALL_EVENTS.filter(event => {
    // Check age range
    if (ageInYears < event.age_min || ageInYears > event.age_max) return false;

    // Don't repeat events (unless they have no id tracking)
    if (state.events_seen.includes(event.id)) return false;

    // Check conditions
    if (event.conditions && event.conditions.length > 0) {
      return event.conditions.every(cond => checkCondition(state, cond));
    }

    return true;
  });
}

function weightedRandomSelect(events: GameEvent[]): GameEvent | null {
  if (events.length === 0) return null;

  const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const event of events) {
    random -= event.weight;
    if (random <= 0) return event;
  }

  return events[events.length - 1];
}

export function selectEvent(state: GameState): GameEvent | null {
  const eligible = getEligibleEvents(state);
  
  if (eligible.length === 0) {
    // Fallback: allow repeats of age-appropriate events
    const ageInYears = state.current_month / 12;
    const ageAppropriate = ALL_EVENTS.filter(e => 
      ageInYears >= e.age_min && ageInYears <= e.age_max
    );
    return weightedRandomSelect(ageAppropriate);
  }

  return weightedRandomSelect(eligible);
}

export function getAllEvents(): GameEvent[] {
  return ALL_EVENTS;
}
