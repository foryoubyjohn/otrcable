/*
 * Design: Storybook Realism — Endgame
 * Final outcome screen with narrative summary, outcome details, and traits
 */
import { useGame } from '../../contexts/GameContext';
import { getTraitIcon, getTraitLabel } from '../../engine/traitEngine';
import type { TraitId } from '../../engine/types';
import { Button } from '@/components/ui/button';
import { Trophy, Heart, DollarSign, AlertTriangle, GraduationCap, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663246257081/DcHQtw6S3jhQaKpMcDmZWt/hero-main-c98GprjJ9KqPJRBGfKpYhk.webp';

export default function Endgame() {
  const { state, resetGame, navigate } = useGame();
  const { gameState } = state;
  if (!gameState || !gameState.endgame_result) return null;

  const result = gameState.endgame_result;

  const outcomeLabels: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
    university: { label: 'University Bound', icon: '🎓', color: '#5a7a9e', bgColor: '#5a7a9e10' },
    community_college: { label: 'Community College', icon: '📚', color: '#5a9e7a', bgColor: '#5a9e7a10' },
    trade_school: { label: 'Trade School', icon: '🔧', color: '#c17f59', bgColor: '#c17f5910' },
    military: { label: 'Military Service', icon: '🎖️', color: '#5a7a5a', bgColor: '#5a7a5a10' },
    workforce: { label: 'Entering Workforce', icon: '💼', color: '#6b5744', bgColor: '#6b574410' },
    entrepreneurship: { label: 'Entrepreneur', icon: '🚀', color: '#7a5a9e', bgColor: '#7a5a9e10' },
    crime: { label: 'Criminal Path', icon: '⚠️', color: '#c75c5c', bgColor: '#c75c5c10' },
    incarceration: { label: 'Incarcerated', icon: '🔒', color: '#8a3a3a', bgColor: '#8a3a3a10' },
    failure: { label: 'Lost & Directionless', icon: '😔', color: '#8a7a6a', bgColor: '#8a7a6a10' },
    death: { label: 'Tragic End', icon: '🕊️', color: '#5a4a3a', bgColor: '#5a4a3a10' },
  };

  const outcome = outcomeLabels[result.outcome] || { label: result.outcome, icon: '❓', color: '#3a2e24', bgColor: '#3a2e2410' };

  return (
    <div className="min-h-screen bg-[#faf6f0] relative">
      {/* Subtle hero accent at top */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/20 to-[#faf6f0]" />
      </div>

      <div className="relative z-10 container py-10 max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <BookOpen className="mx-auto mb-3 text-[#c17f59]" size={28} />
          <h1 className="font-display text-4xl font-bold text-[#3a2e24] mb-2">The Story Ends</h1>
          <p className="font-accent text-xl text-[#8a7a6a]">
            {gameState.child_name}'s journey from birth to adulthood
          </p>
        </div>

        {/* Main Outcome Card */}
        <div className="bg-white rounded-xl shadow-lg border border-[#e8ddd0] p-8 text-center mb-6">
          <span className="text-6xl mb-4 block">{outcome.icon}</span>
          <h2 className="font-display text-3xl font-bold mb-3" style={{ color: outcome.color }}>
            {outcome.label}
          </h2>
          <p className="font-body text-[#5a4a3a]/85 leading-relaxed max-w-lg mx-auto text-[15px]">
            {result.narrative}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: GraduationCap, label: 'Education', text: result.education, color: '#5a7a9e' },
            { icon: Heart, label: 'Relationship', text: result.relationship, color: '#c17f59' },
            { icon: DollarSign, label: 'Financial Readiness', text: result.financial_readiness, color: '#7a9e7e' },
            { icon: AlertTriangle, label: 'Risk Assessment', text: result.risk_outcome, color: '#d4a853' },
          ].map(({ icon: Icon, label, text, color }) => (
            <div key={label} className="bg-white rounded-lg shadow-sm border border-[#e8ddd0] p-4">
              <h3 className="font-display text-xs font-bold mb-2 flex items-center gap-1.5 uppercase tracking-widest" style={{ color }}>
                <Icon size={13} /> {label}
              </h3>
              <p className="font-body text-sm text-[#5a4a3a] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Offers */}
        {result.offers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 mb-6">
            <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-[#c17f59]" /> Opportunities Earned
            </h3>
            <ul className="space-y-2.5">
              {result.offers.map((offer: string, i: number) => (
                <li key={i} className="flex items-center gap-3 font-body text-sm text-[#5a4a3a]">
                  <span className="w-2 h-2 rounded-full bg-[#c17f59] shrink-0" />
                  {offer}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final Traits */}
        {result.traits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6 mb-8">
            <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#c17f59]" /> Final Traits
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.traits.map((traitId: TraitId) => (
                <span
                  key={traitId}
                  className="inline-flex items-center gap-1.5 text-sm font-body px-3 py-1.5 rounded-full bg-[#f5efe6] border border-[#e8ddd0] text-[#5a4a3a]"
                >
                  {getTraitIcon(traitId)} {getTraitLabel(traitId)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('timeline')}
            variant="outline"
            size="lg"
            className="font-body border-[#d4c4a8] text-[#8a7a6a] hover:text-[#c17f59] hover:border-[#c17f59]/40"
          >
            <BookOpen className="mr-2" size={16} />
            View Full Timeline
          </Button>
          <Button
            onClick={resetGame}
            size="lg"
            className="font-body bg-[#c17f59] hover:bg-[#a86b48] text-white shadow-md"
          >
            <RotateCcw className="mr-2" size={16} />
            Start New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
