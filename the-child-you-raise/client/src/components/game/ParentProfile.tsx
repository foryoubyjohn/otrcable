/*
 * Design: Storybook Realism — Parent Profile
 * Warm editorial layout with parenting style card, stat bars, work-life balance
 */
import { useGame } from '../../contexts/GameContext';
import StatBar from './StatBar';
import { ArrowLeft, Heart, Brain, Shield, Clock, Briefcase } from 'lucide-react';

const styleInfo: Record<string, { emoji: string; color: string; desc: string }> = {
  'Authoritative': { emoji: '⚖️', color: 'border-[#7a9e7e] bg-[#7a9e7e]/5', desc: 'Warm but firm. You balance love with clear expectations and consistent boundaries.' },
  'Authoritarian': { emoji: '🏛️', color: 'border-[#5a7a9e] bg-[#5a7a9e]/5', desc: 'Strict and demanding. Rules are rules, and obedience is expected without question.' },
  'Permissive': { emoji: '🌸', color: 'border-[#c17f59] bg-[#c17f59]/5', desc: 'Loving but lenient. You avoid conflict and let your child set their own boundaries.' },
  'Uninvolved': { emoji: '🌫️', color: 'border-[#8a7a6a] bg-[#8a7a6a]/5', desc: 'Distant and disengaged. Basic needs are met but emotional connection is lacking.' },
  'Inconsistent': { emoji: '🎭', color: 'border-[#d4a853] bg-[#d4a853]/5', desc: 'Unpredictable. Your approach varies day to day, making it hard for your child to know what to expect.' },
};

export default function ParentProfile() {
  const { state, navigate } = useGame();
  const { gameState } = state;
  if (!gameState) return null;

  const style = styleInfo[gameState.parenting_style] || styleInfo['Inconsistent'];

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

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] p-6 mb-5">
          <h2 className="font-display text-3xl font-bold text-[#3a2e24] mb-1">{gameState.parent_name}</h2>
          <p className="font-body text-[#8a7a6a] mb-5">Parent</p>

          <div className={`p-4 rounded-lg border-l-4 ${style.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{style.emoji}</span>
              <span className="font-body font-semibold text-sm text-[#5a4a3a]">Parenting Style:</span>
              <span className="font-display font-bold text-[#c17f59]">{gameState.parenting_style}</span>
            </div>
            <p className="text-xs font-body text-[#8a7a6a] italic leading-relaxed">
              {style.desc}
            </p>
          </div>
        </div>

        {/* Parent Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 mb-5">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <Heart size={18} className="text-[#c17f59]" />
            Parent Stats
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Stress', value: gameState.parent.stress, icon: Brain, barColor: '#d4a853' },
              { label: 'Patience', value: gameState.parent.patience, icon: Clock, barColor: undefined },
              { label: 'Warmth', value: gameState.parent.warmth, icon: Heart, barColor: '#c17f59' },
              { label: 'Structure', value: gameState.parent.structure, icon: Shield, barColor: '#5a7a9e' },
              { label: 'Harshness', value: gameState.parent.harshness, icon: Shield, barColor: '#c75c5c' },
              { label: 'Neglect', value: gameState.parent.neglect, icon: Shield, barColor: '#8a7a6a' },
            ].map(({ label, value, icon: Icon, barColor }) => (
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
                      backgroundColor: barColor || (value >= 70 ? '#7a9e7e' : value >= 40 ? '#d4a853' : '#c75c5c'),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work-Life Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <Briefcase size={18} className="text-[#c17f59]" />
            Work-Life Balance
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#e8ddd0] text-center">
              <span className="text-xs font-body text-[#8a7a6a] block mb-1">Work Hours / Week</span>
              <span className="font-mono text-2xl font-bold text-[#3a2e24]">{Math.round(gameState.parent.work_hours)}h</span>
            </div>
            <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#e8ddd0] text-center">
              <span className="text-xs font-body text-[#8a7a6a] block mb-1">Time for Child</span>
              <span className="font-mono text-2xl font-bold text-[#3a2e24]">{Math.round(gameState.household.time_available)}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock size={13} className="text-[#8a7a6a]" />
              <span className="text-xs font-body font-semibold text-[#5a4a3a]">Time Available</span>
              <span className="ml-auto text-xs font-mono text-[#8a7a6a]">{Math.round(gameState.household.time_available)}</span>
            </div>
            <div className="h-2 bg-[#f0e8dc] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, gameState.household.time_available))}%`,
                  backgroundColor: gameState.household.time_available >= 60 ? '#7a9e7e' : gameState.household.time_available >= 35 ? '#d4a853' : '#c75c5c',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
