// ============================================================
// Admissions/Endgame Engine — Calculates post-high-school outcomes
// ============================================================

import type { GameState, EndgameResult, EndgameOutcome } from './types';

interface OutcomeScore {
  outcome: EndgameOutcome;
  score: number;
  offers: string[];
}

function calculateOutcomeScores(state: GameState): OutcomeScore[] {
  const scores: OutcomeScore[] = [];

  // University
  const uniScore = (
    state.child_hidden.intelligence * 0.3 +
    state.child_visible.academics * 0.3 +
    state.child_hidden.discipline * 0.15 +
    state.child_hidden.ambition * 0.15 +
    state.school.college_preparation * 0.1
  );
  const uniOffers: string[] = [];
  if (uniScore > 75) uniOffers.push('Scholarship to State University');
  if (uniScore > 85) uniOffers.push('Acceptance to Top-Tier University');
  if (uniScore > 60) uniOffers.push('Admission to Local University');
  scores.push({ outcome: 'university', score: uniScore, offers: uniOffers });

  // Community College
  const ccScore = (
    state.child_visible.academics * 0.3 +
    state.child_hidden.ambition * 0.2 +
    state.child_hidden.discipline * 0.2 +
    (100 - state.risks.dropout) * 0.15 +
    state.household.money > 1000 ? 15 : 5
  );
  scores.push({ outcome: 'community_college', score: ccScore, offers: ['Community College Admission'] });

  // Trade School
  const tradeScore = (
    state.child_hidden.discipline * 0.25 +
    state.school.trade_preparation * 0.2 +
    state.child_hidden.creativity * 0.15 +
    state.child_hidden.resilience * 0.15 +
    (100 - state.child_hidden.ambition) * 0.1 +
    state.child_visible.behavior * 0.15
  );
  const tradeOffers: string[] = [];
  if (tradeScore > 55) tradeOffers.push('Electrician Apprenticeship');
  if (tradeScore > 60) tradeOffers.push('Plumbing Certification Program');
  if (tradeScore > 65) tradeOffers.push('Automotive Technology Program');
  scores.push({ outcome: 'trade_school', score: tradeScore, offers: tradeOffers });

  // Military
  const militaryScore = (
    state.child_hidden.discipline * 0.3 +
    state.child_visible.health * 0.2 +
    state.child_hidden.resilience * 0.2 +
    state.child_visible.behavior * 0.15 +
    (100 - state.risks.substance) * 0.15
  );
  const milOffers: string[] = [];
  if (militaryScore > 50) milOffers.push('Military Enlistment');
  if (militaryScore > 70) milOffers.push('Officer Candidate Program');
  scores.push({ outcome: 'military', score: militaryScore, offers: milOffers });

  // Workforce
  const workScore = (
    state.child_hidden.discipline * 0.2 +
    state.child_hidden.resilience * 0.2 +
    state.child_visible.behavior * 0.2 +
    state.child_hidden.social_skill * 0.2 +
    state.child_visible.health * 0.2
  );
  scores.push({ outcome: 'workforce', score: workScore, offers: ['Entry-level Employment'] });

  // Entrepreneurship
  const entScore = (
    state.child_hidden.creativity * 0.25 +
    state.child_hidden.ambition * 0.25 +
    state.child_hidden.risk_tolerance * 0.15 +
    state.child_hidden.intelligence * 0.15 +
    state.child_hidden.social_skill * 0.1 +
    state.child_hidden.resilience * 0.1
  );
  scores.push({ outcome: 'entrepreneurship', score: entScore, offers: entScore > 65 ? ['Small Business Startup'] : [] });

  // Crime
  const crimeScore = state.risks.crime * 0.6 + (100 - state.child_hidden.morality) * 0.2 + (100 - state.relationship) * 0.2;
  scores.push({ outcome: 'crime', score: crimeScore, offers: [] });

  // Incarceration
  const incarScore = state.risks.crime * 0.7 + (100 - state.child_hidden.discipline) * 0.15 + state.child_hidden.impulsiveness * 0.15;
  scores.push({ outcome: 'incarceration', score: incarScore > 60 ? incarScore : 0, offers: [] });

  // Failure (NEET)
  const failScore = (
    (100 - state.child_hidden.ambition) * 0.3 +
    (100 - state.child_hidden.discipline) * 0.2 +
    state.risks.dropout * 0.2 +
    state.risks.mental_health * 0.15 +
    (100 - state.child_hidden.resilience) * 0.15
  );
  scores.push({ outcome: 'failure', score: failScore > 55 ? failScore : 0, offers: [] });

  // Death (extreme cases only)
  const deathScore = (
    state.risks.substance > 80 ? 20 : 0 +
    state.risks.injury > 80 ? 20 : 0 +
    state.risks.crime > 80 ? 15 : 0 +
    state.child_visible.health < 15 ? 15 : 0
  );
  scores.push({ outcome: 'death', score: deathScore, offers: [] });

  return scores.sort((a, b) => b.score - a.score);
}

function generateNarrative(state: GameState, outcome: EndgameOutcome): string {
  const name = state.child_name;
  const traits = state.active_traits;
  
  const narratives: Record<EndgameOutcome, string> = {
    university: `${name} graduated high school with strong academics and a clear vision for the future. Years of steady guidance and intellectual curiosity paid off as college acceptance letters arrived. The journey ahead is full of promise.`,
    community_college: `${name} chose a practical path forward, enrolling in community college to build skills and explore interests. It's a solid foundation — not everyone needs the traditional four-year route to find success.`,
    trade_school: `${name} discovered a passion for working with their hands and solving real-world problems. Trade school offers a direct path to a stable career, and ${name} is ready to build something tangible.`,
    military: `${name} found purpose in service and structure. The military offers discipline, direction, and a sense of belonging that resonated deeply. It's a path of sacrifice and honor.`,
    workforce: `${name} stepped directly into the working world, ready to earn and learn through experience. Not every path requires a classroom — sometimes life itself is the best teacher.`,
    entrepreneurship: `${name}'s creative spirit and ambition couldn't be contained by traditional paths. With a head full of ideas and the courage to take risks, ${name} set out to build something of their own.`,
    crime: `Despite ${state.parent_name}'s efforts, ${name} fell in with the wrong crowd. The streets offered what home and school couldn't — or so it seemed. The path ahead is dangerous and uncertain.`,
    incarceration: `The choices accumulated, the risks compounded, and eventually the law caught up. ${name} faces consequences that will shape years to come. But even from here, redemption isn't impossible.`,
    failure: `${name} drifted after high school, unable to find direction or motivation. The world feels overwhelming, and the future uncertain. But this isn't the end — it's a difficult beginning.`,
    death: `Tragedy struck before adulthood could fully begin. The risks were too great, the safety nets too thin. ${state.parent_name} is left with memories and what-ifs.`,
  };

  let narrative = narratives[outcome];

  // Add trait-specific flavor
  if (traits.includes('resilient')) narrative += ` ${name}'s resilience will serve them well in whatever comes next.`;
  if (traits.includes('anxious')) narrative += ` The anxiety that followed ${name} through childhood remains a challenge to manage.`;
  if (traits.includes('curious')) narrative += ` That insatiable curiosity continues to drive ${name} forward.`;
  if (traits.includes('rebellious')) narrative += ` The rebellious streak that defined ${name}'s youth may yet become a force for change.`;

  return narrative;
}

export function calculateEndgame(state: GameState): EndgameResult {
  const scores = calculateOutcomeScores(state);
  const topOutcome = scores[0];

  // Determine relationship outcome
  let relationshipOutcome: string;
  if (state.relationship > 75) relationshipOutcome = 'Strong, loving bond with parent';
  else if (state.relationship > 55) relationshipOutcome = 'Healthy but somewhat distant relationship';
  else if (state.relationship > 35) relationshipOutcome = 'Strained relationship with unresolved tension';
  else relationshipOutcome = 'Broken relationship, minimal contact';

  // Financial readiness
  let financialReadiness: string;
  if (state.household.money > 5000 && state.household.debt < 2000) financialReadiness = 'Well-prepared financially';
  else if (state.household.money > 2000) financialReadiness = 'Modest savings, manageable situation';
  else if (state.household.debt > 10000) financialReadiness = 'Burdened by family debt';
  else financialReadiness = 'Starting from scratch financially';

  // Risk outcome
  const highRisks = Object.entries(state.risks)
    .filter(([_, v]) => v > 40)
    .map(([k, _]) => k);
  let riskOutcome: string;
  if (highRisks.length === 0) riskOutcome = 'No significant risk factors';
  else if (highRisks.length <= 2) riskOutcome = `Moderate concerns: ${highRisks.join(', ')}`;
  else riskOutcome = `Multiple risk factors: ${highRisks.join(', ')}`;

  return {
    outcome: topOutcome.outcome,
    traits: [...state.active_traits],
    education: getEducationSummary(state),
    relationship: relationshipOutcome,
    financial_readiness: financialReadiness,
    risk_outcome: riskOutcome,
    offers: topOutcome.offers,
    narrative: generateNarrative(state, topOutcome.outcome),
  };
}

function getEducationSummary(state: GameState): string {
  if (state.child_visible.academics > 80) return 'Excellent student, top of class';
  if (state.child_visible.academics > 60) return 'Good student, above average';
  if (state.child_visible.academics > 40) return 'Average student, passing grades';
  if (state.child_visible.academics > 25) return 'Struggling student, below average';
  return 'Severely behind academically';
}
