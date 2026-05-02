# The Child You Raise

A browser-based 2D card/menu life-simulation strategy game where you raise a child from birth to adulthood. Every parenting choice shapes their development, personality, and future.

Inspired by **Crusader Kings III**, **The Sims**, and **BitLife**.

## Quick Start

```bash
cd the-child-you-raise
pnpm install
pnpm run dev
```

Open `http://localhost:3000` in your browser.

## Game Overview

The game advances one month at a time. Each month generates a CK3-style event card with 2-4 choices. Your decisions affect:

- **Child development** (12 hidden stats, 6 visible stats)
- **Traits** (20 emergent personality traits)
- **Parent-child relationship**
- **Household resources** (money, housing, food security)
- **School performance** and peer dynamics
- **Risk factors** (crime, dropout, substance use, mental health)
- **Long-term outcomes** (10 possible post-high-school paths)

## Architecture

### Game Engines

| Engine | File | Purpose |
|--------|------|---------|
| Game State | `src/engine/gameState.ts` | Creates initial state, age/phase calculations |
| Stat Engine | `src/engine/statEngine.ts` | Applies choice effects, monthly updates |
| Event Engine | `src/engine/eventEngine.ts` | Selects age-appropriate events, weighted random |
| Trait Engine | `src/engine/traitEngine.ts` | Evaluates trait emergence from counters + stats |
| Risk Engine | `src/engine/riskEngine.ts` | Calculates risk factors from conditions |
| Admissions Engine | `src/engine/admissionsEngine.ts` | Calculates endgame outcomes at age 18 |
| Save Engine | `src/engine/saveEngine.ts` | localStorage persistence |

### Data Files

| File | Contents |
|------|----------|
| `src/data/events/infancy.json` | 22 events (ages 0-4) |
| `src/data/events/elementary.json` | 15 events (ages 5-10) |
| `src/data/events/middleSchool.json` | 16 events (ages 11-13) |
| `src/data/events/highSchool.json` | 16 events (ages 14-18) |
| `src/data/traits.json` | 20 trait definitions |
| `src/data/schools.json` | School quality presets |

**Total: 69 events** across all life phases.

### UI Screens

- **Main Menu** — New Game / Continue
- **New Game** — Parent name, child name, difficulty
- **Dashboard** — Event card, stats sidebar, navigation
- **Child Profile** — Visible stats, traits, narrative
- **Parent Profile** — Parenting style, stress, work-life balance
- **Household** — Finances, living conditions
- **School & Peers** — School quality, peer dynamics, risk factors
- **Timeline** — Chronological life events
- **Endgame** — Final outcome, narrative summary, offers

## Simulation Systems

### Hidden Stats (12)

Intelligence, Discipline, Emotional Stability, Confidence, Social Skill, Morality, Risk Tolerance, Creativity, Ambition, Resilience, Attachment, Impulsiveness.

### Visible Stats (6)

Academics, Behavior, Health, Confidence, Social Life, Future Outlook.

### Traits (20)

Curious, Sensitive, Independent, Defiant, Empathetic, Competitive, Gifted, Underachiever, Easily Distracted, Popular, Loner, Leader, Follower, Rebellious, Sneaky, Responsible, Anxious, Resilient, Street Smart, Trouble Magnet.

### Parenting Styles

Calculated from repeated choices:
- **Authoritative** — Warm + structured
- **Authoritarian** — Strict + demanding
- **Permissive** — Loving + lenient
- **Uninvolved** — Distant + disengaged
- **Inconsistent** — Unpredictable

### Endgame Outcomes (10)

University, Community College, Trade School, Military, Workforce, Entrepreneurship, Crime, Incarceration, Failure, Death.

## Adding New Events

Events are JSON objects with this structure:

```json
{
  "id": "elem_016",
  "title": "Event Title",
  "description": "Narrative description of the situation.",
  "age_min": 5,
  "age_max": 10,
  "category": "academics",
  "conditions": [],
  "weight": 1,
  "choices": [
    {
      "id": "a",
      "text": "Choice text shown to player",
      "effects": {
        "child_hidden": { "intelligence": 3 },
        "child_visible": { "academics": 2 },
        "parent": { "stress": 5 },
        "household": {},
        "relationship": 2,
        "risks": {},
        "traits": { "curious": 1 },
        "money": -100
      },
      "result_text": "Narrative result of this choice.",
      "timeline_text": "Short timeline entry."
    }
  ]
}
```

### Event Categories

parenting, development, behavior, health, social, household, academics, emotional, risk, milestone, technology, identity, family, education, career.

### Conditions

Events can have conditions that must be met:

```json
{
  "type": "stat",
  "field": "intelligence",
  "operator": ">",
  "value": 60
}
```

Types: `stat`, `trait`, `risk`, `household`, `school`.

## Balancing Stats

- All stats range from 0-100
- Monthly income/bills affect money each month
- Trait counters increment by choice effects; traits activate at threshold (typically 4-7)
- Risk factors are influenced by household conditions, school quality, and peer pressure
- The endgame engine weights multiple factors to determine outcomes

### Difficulty Modifiers

| Setting | Starting Money | Income | Bills | Stress | Hidden Stats |
|---------|---------------|--------|-------|--------|-------------|
| Easy | $5,000 | $4,500 | $2,800 | 20 | 55 base |
| Normal | $3,000 | $3,500 | $3,000 | 30 | 50 base |
| Hard | $1,500 | $2,500 | $2,800 | 40 | 45 base |

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- Vite
- localStorage for saves
- No backend required

## Suggested Next Improvements

1. **More events** — Add 100+ more events for deeper variety
2. **Random events** — Monthly chance of random life events (accidents, windfalls)
3. **Multiple children** — Support raising siblings
4. **Relationship system** — Add friends, romantic interests, mentors
5. **Sound effects** — Audio feedback for choices and milestones
6. **Achievement system** — Unlock achievements across playthroughs
7. **Stat visualization** — Charts showing stat progression over time
8. **Event chains** — Multi-part storylines that span months
9. **Mod support** — Load custom event packs from JSON
10. **Mobile optimization** — Touch-friendly controls and layout

## License

MIT
