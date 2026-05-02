/*
 * Design: Storybook Realism — School & Peers
 * School environment, peer dynamics, and risk factors
 */
import { useGame } from '../../contexts/GameContext';
import { getSchoolPhase } from '../../engine/gameState';
import { getRiskLevel } from '../../engine/riskEngine';
import { ArrowLeft, GraduationCap, Users, AlertTriangle, BookOpen, Shield, Star } from 'lucide-react';

export default function School() {
  const { state, navigate } = useGame();
  const { gameState } = state;
  if (!gameState) return null;

  const schoolPhase = getSchoolPhase(gameState.current_month);
  const s = gameState.school;
  const risks = gameState.risks;

  const schoolStats = [
    { label: 'School Quality', value: s.quality },
    { label: 'Safety', value: s.safety },
    { label: 'Teacher Support', value: s.teacher_support },
    { label: 'College Prep', value: s.college_preparation },
    { label: 'Trade Prep', value: s.trade_preparation },
  ];

  const peerStats = [
    { label: 'Peer Quality', value: s.peer_quality },
    { label: 'Peer Pressure', value: s.peer_pressure },
    { label: 'Social Status', value: s.social_status },
  ];

  const riskColors: Record<string, string> = {
    low: '#7a9e7e',
    moderate: '#d4a853',
    high: '#c17f59',
    critical: '#c75c5c',
  };

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

        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-3xl font-bold text-[#3a2e24]">School & Peers</h2>
          <span className="text-xs font-body px-3 py-1 rounded-full bg-[#f5efe6] border border-[#e8ddd0] text-[#8a7a6a]">
            {schoolPhase}
          </span>
        </div>

        {/* School Environment */}
        <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] p-6 mb-5">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <GraduationCap size={18} className="text-[#c17f59]" /> School Environment
          </h3>
          <div className="space-y-4">
            {schoolStats.map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen size={12} className="text-[#8a7a6a]" />
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

        {/* Peer Environment */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 mb-5">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <Users size={18} className="text-[#c17f59]" /> Peer Environment
          </h3>
          <div className="space-y-4">
            {peerStats.map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Star size={12} className="text-[#8a7a6a]" />
                  <span className="text-xs font-body font-semibold text-[#5a4a3a]">{label}</span>
                  <span className="ml-auto text-xs font-mono text-[#8a7a6a]">{Math.round(value)}</span>
                </div>
                <div className="h-2 bg-[#f0e8dc] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, value))}%`,
                      backgroundColor: label === 'Peer Pressure'
                        ? (value >= 60 ? '#c75c5c' : value >= 30 ? '#d4a853' : '#7a9e7e')
                        : (value >= 70 ? '#7a9e7e' : value >= 40 ? '#d4a853' : '#c75c5c'),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#c75c5c]" /> Risk Factors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(risks).map(([key, value]) => {
              const level = getRiskLevel(value);
              const color = riskColors[level];
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              return (
                <div key={key} className="bg-[#faf6f0] rounded-lg p-3 border border-[#e8ddd0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-body font-semibold text-[#5a4a3a]">{label}</span>
                    <span
                      className="text-[10px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: color + '20', color }}
                    >
                      {level}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#f0e8dc] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
