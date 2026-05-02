/*
 * Design: Storybook Realism — Child Profile
 * Warm editorial layout with narrative description, stat bars, and trait cards
 */
import { useGame } from '../../contexts/GameContext';
import { getAgeString, getLifePhase } from '../../engine/gameState';
import { getTraitIcon, getTraitLabel, getTraitDescription } from '../../engine/traitEngine';
import StatBar from './StatBar';
import { ArrowLeft, Heart, BookOpen, Brain, Smile, Users, Compass, Sparkles } from 'lucide-react';

export default function ChildProfile() {
  const { state, navigate } = useGame();
  const { gameState } = state;
  if (!gameState) return null;

  const age = getAgeString(gameState.current_month);
  const phase = getLifePhase(gameState.current_month);

  const generateNarrative = (): string => {
    const name = gameState.child_name;
    const vis = gameState.child_visible;
    const traits = gameState.active_traits;

    let desc = `${name} is a ${age} old child in their ${phase.toLowerCase()} phase. `;

    if (vis.academics > 70) desc += `They excel academically and show a genuine love of learning. `;
    else if (vis.academics < 35) desc += `They struggle in school and seem disengaged from academics. `;

    if (vis.confidence > 70) desc += `They carry themselves with natural confidence. `;
    else if (vis.confidence < 35) desc += `They often seem unsure of themselves. `;

    if (vis.social_life > 70) desc += `They have a thriving social life with many friends. `;
    else if (vis.social_life < 35) desc += `They tend to keep to themselves socially. `;

    if (traits.includes('curious')) desc += `Their curiosity drives them to explore everything. `;
    if (traits.includes('anxious')) desc += `Anxiety is a daily companion they're learning to manage. `;
    if (traits.includes('resilient')) desc += `They bounce back from setbacks with remarkable strength. `;
    if (traits.includes('rebellious')) desc += `They push back against authority at every turn. `;

    if (vis.future_outlook > 65) desc += `The future looks bright for ${name}.`;
    else if (vis.future_outlook < 35) desc += `The path ahead seems uncertain.`;
    else desc += `They're finding their way, one day at a time.`;

    return desc;
  };

  const statItems = [
    { label: 'Academics', value: gameState.child_visible.academics, icon: BookOpen },
    { label: 'Behavior', value: gameState.child_visible.behavior, icon: Smile },
    { label: 'Health', value: gameState.child_visible.health, icon: Heart },
    { label: 'Confidence', value: gameState.child_visible.confidence, icon: Brain },
    { label: 'Social Life', value: gameState.child_visible.social_life, icon: Users },
    { label: 'Future Outlook', value: gameState.child_visible.future_outlook, icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="container py-6 max-w-3xl">
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2 text-[#8a7a6a] hover:text-[#c17f59] mb-6 font-body transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] p-6 mb-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#3a2e24]">{gameState.child_name}</h2>
              <p className="font-body text-[#8a7a6a] mt-1">{age} — {phase}</p>
            </div>
            <div className="text-right bg-[#f5efe6] rounded-lg px-4 py-2 border border-[#e8ddd0]">
              <span className="text-xs font-body text-[#8a7a6a] block">Bond</span>
              <div className="font-mono text-xl font-bold text-[#c17f59]">{Math.round(gameState.relationship)}%</div>
            </div>
          </div>

          {/* Narrative */}
          <div className="bg-[#faf6f0] rounded-lg p-4 border-l-3 border-l-[#c17f59]">
            <p className="font-accent text-[15px] text-[#5a4a3a] leading-relaxed italic">
              {generateNarrative()}
            </p>
          </div>
        </div>

        {/* Development Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 mb-5">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#f5efe6] border border-[#e8ddd0] flex items-center justify-center">
              📊
            </span>
            Development
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {statItems.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={13} className="text-[#8a7a6a]" />
                  <span className="text-xs font-body font-semibold text-[#5a4a3a]">{label}</span>
                  <span className="ml-auto text-xs font-mono text-[#8a7a6a]">{Math.round(value)}</span>
                </div>
                <div className="h-2 bg-[#f0e8dc] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, value))}%`,
                      backgroundColor: value >= 70 ? '#7a9e7e' : value >= 40 ? '#d4a853' : '#c75c5c',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traits */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[#c17f59]" />
            Traits
          </h3>
          {gameState.active_traits.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm font-body text-[#8a7a6a] italic">
                No traits have emerged yet.
              </p>
              <p className="text-xs font-body text-[#b0a090] mt-1">
                Traits develop based on your choices and the child's experiences over time.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {gameState.active_traits.map((traitId) => (
                <div key={traitId} className="flex items-start gap-3 p-3 rounded-lg bg-[#faf6f0] border border-[#e8ddd0]">
                  <span className="text-xl mt-0.5">{getTraitIcon(traitId)}</span>
                  <div>
                    <span className="font-body font-semibold text-sm text-[#3a2e24]">{getTraitLabel(traitId)}</span>
                    <p className="text-xs font-body text-[#8a7a6a] mt-0.5">{getTraitDescription(traitId)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
