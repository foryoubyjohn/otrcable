/*
 * Design: Storybook Realism — Life Timeline
 * Vertical timeline with milestone markers and event cards
 */
import { useGame } from '../../contexts/GameContext';
import { ArrowLeft, Star, Circle, BookOpen } from 'lucide-react';

export default function Timeline() {
  const { state, navigate } = useGame();
  const { gameState } = state;
  if (!gameState) return null;

  const entries = [...gameState.timeline].reverse();

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

        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={22} className="text-[#c17f59]" />
          <h2 className="font-display text-3xl font-bold text-[#3a2e24]">Life Timeline</h2>
        </div>
        <p className="font-body text-sm text-[#8a7a6a] mb-8">
          {entries.length} events recorded in {gameState.child_name}'s life
        </p>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-10 text-center">
            <p className="font-accent text-lg text-[#8a7a6a] italic">
              No events recorded yet.
            </p>
            <p className="font-body text-sm text-[#b0a090] mt-1">
              Make choices to build your child's story.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {entries.map((entry, i) => (
              <div key={i} className="relative pl-10 pb-6 last:pb-0">
                {/* Vertical line */}
                {i < entries.length - 1 && (
                  <div className="absolute left-[15px] top-6 bottom-0 w-px bg-[#d4c4a8]" />
                )}
                {/* Dot / Star */}
                <div className="absolute left-0 top-1">
                  {entry.isMilestone ? (
                    <div className="w-8 h-8 rounded-full bg-[#c17f59]/10 border-2 border-[#c17f59] flex items-center justify-center">
                      <Star size={14} className="text-[#c17f59] fill-[#c17f59]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#d4c4a8] flex items-center justify-center">
                      <Circle size={8} className="text-[#d4c4a8] fill-[#d4c4a8]" />
                    </div>
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e8ddd0] p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-accent text-sm text-[#8a7a6a]">{entry.age}</span>
                    {entry.isMilestone && (
                      <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-[#c17f59]/10 text-[#c17f59] uppercase tracking-wider">
                        Milestone
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-base font-bold text-[#3a2e24] mb-1.5">{entry.title}</h4>
                  <p className="text-xs font-body text-[#c17f59] mb-1">
                    Choice: {entry.choice}
                  </p>
                  <p className="text-xs font-body text-[#8a7a6a] italic leading-relaxed">
                    {entry.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
