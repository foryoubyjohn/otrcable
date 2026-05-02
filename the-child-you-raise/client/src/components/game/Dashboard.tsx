/*
 * Design: Storybook Realism — Dashboard
 * Main game screen with event card, stats sidebar, and navigation
 * Warm paper texture, editorial card layout
 */
import { useGame } from '../../contexts/GameContext';
import { getAgeString, getLifePhase, getSchoolPhase } from '../../engine/gameState';
import { getActiveWarnings } from '../../engine/riskEngine';
import { getTraitIcon, getTraitLabel } from '../../engine/traitEngine';
import EventCard from './EventCard';
import StatBar from './StatBar';
import { Button } from '@/components/ui/button';
import {
  User, Home, GraduationCap, Clock, BookOpen,
  AlertTriangle, DollarSign, Heart, ArrowRight,
  Save, Sparkles, Shield
} from 'lucide-react';

const phaseEmoji: Record<string, string> = {
  'Infancy': '🍼',
  'Toddler': '🧸',
  'Early Childhood': '🎨',
  'Elementary School': '📚',
  'Middle School': '🎒',
  'High School': '🎓',
};

export default function Dashboard() {
  const { state, advanceMonth, navigate, clearResult } = useGame();
  const { gameState, eventResult } = state;

  if (!gameState) return null;

  const age = getAgeString(gameState.current_month);
  const lifePhase = getLifePhase(gameState.current_month);
  const schoolPhase = getSchoolPhase(gameState.current_month);
  const warnings = getActiveWarnings(gameState);
  const emoji = phaseEmoji[lifePhase] || '👶';

  const navItems = [
    { screen: 'child' as const, icon: User, label: 'Child', tip: 'Child Profile' },
    { screen: 'parent' as const, icon: Heart, label: 'Parent', tip: 'Parent Profile' },
    { screen: 'household' as const, icon: Home, label: 'Home', tip: 'Household' },
    { screen: 'school' as const, icon: GraduationCap, label: 'School', tip: 'School & Peers' },
    { screen: 'timeline' as const, icon: Clock, label: 'Timeline', tip: 'Life Timeline' },
  ];

  const netIncome = gameState.household.monthly_income - gameState.household.monthly_bills;

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e8ddd0] shadow-sm">
        <div className="container py-2.5">
          <div className="flex items-center justify-between">
            {/* Child Info */}
            <div className="flex items-center gap-3">
              <span className="text-xl">{emoji}</span>
              <div>
                <h1 className="font-display text-base font-bold text-[#3a2e24] leading-tight">{gameState.child_name}</h1>
                <p className="text-xs font-body text-[#8a7a6a]">{age} — {lifePhase}</p>
              </div>
            </div>

            {/* Nav Icons */}
            <div className="flex items-center gap-0.5">
              {navItems.map(({ screen, icon: Icon, tip }) => (
                <button
                  key={screen}
                  onClick={() => navigate(screen)}
                  className="p-2.5 rounded-lg hover:bg-[#f5efe6] transition-colors text-[#8a7a6a] hover:text-[#c17f59]"
                  title={tip}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Event Result Banner */}
            {eventResult && (
              <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] p-6 border-l-4 border-l-[#7a9e7e]">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📝</span>
                  <div className="flex-1">
                    <p className="font-body text-[#3a2e24]/90 italic leading-relaxed text-[15px]">{eventResult}</p>
                    <Button
                      onClick={clearResult}
                      variant="ghost"
                      size="sm"
                      className="mt-3 font-body text-[#c17f59] hover:text-[#a86b48] hover:bg-[#c17f59]/10"
                    >
                      Continue <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Event Card */}
            {gameState.current_event && !eventResult && (
              <EventCard event={gameState.current_event} />
            )}

            {/* Advance Month Button */}
            {(!gameState.current_event || eventResult) && (
              <div className="flex justify-center pt-2">
                <Button
                  onClick={advanceMonth}
                  size="lg"
                  className="h-14 px-10 text-lg font-body font-semibold bg-[#c17f59] hover:bg-[#a86b48] text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Clock className="mr-2" size={20} />
                  Advance Month
                </Button>
              </div>
            )}

            {/* No event placeholder */}
            {!gameState.current_event && !eventResult && (
              <div className="bg-white/60 rounded-xl border border-dashed border-[#d4c4a8] p-8 text-center">
                <p className="font-accent text-lg text-[#8a7a6a]">
                  A quiet month passes...
                </p>
                <p className="font-body text-sm text-[#8a7a6a]/70 mt-1">
                  Advance to the next month to see what happens.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Stats Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-5">
              <h3 className="font-display text-xs font-bold mb-4 text-[#8a7a6a] uppercase tracking-widest">Overview</h3>
              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between items-center">
                  <span className="text-[#8a7a6a] flex items-center gap-2"><GraduationCap size={14} /> School</span>
                  <span className="font-medium text-[#3a2e24]">{schoolPhase}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8a7a6a] flex items-center gap-2"><DollarSign size={14} /> Savings</span>
                  <span className="font-mono font-semibold text-[#3a2e24]">${gameState.household.money.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8a7a6a] flex items-center gap-2"><BookOpen size={14} /> Monthly</span>
                  <span className={`font-mono text-xs font-medium ${netIncome >= 0 ? 'text-[#7a9e7e]' : 'text-[#c75c5c]'}`}>
                    {netIncome >= 0 ? '+' : ''}{netIncome}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Relationship Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-5">
              <h3 className="font-display text-xs font-bold mb-4 text-[#8a7a6a] uppercase tracking-widest">Relationship</h3>
              <div className="space-y-3">
                <StatBar label="Parent-Child Bond" value={gameState.relationship} color="auto" />
                <StatBar label="Parent Stress" value={gameState.parent.stress} color="bg-amber-500" />
              </div>
            </div>

            {/* Active Traits */}
            {gameState.active_traits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-5">
                <h3 className="font-display text-xs font-bold mb-3 text-[#8a7a6a] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} /> Traits
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {gameState.active_traits.map((traitId) => (
                    <span
                      key={traitId}
                      className="inline-flex items-center gap-1 text-xs font-body px-2.5 py-1 rounded-full bg-[#f5efe6] border border-[#e8ddd0] text-[#5a4a3a]"
                    >
                      {getTraitIcon(traitId)} {getTraitLabel(traitId)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-5 border-l-4 border-l-[#c75c5c]">
                <h3 className="font-display text-xs font-bold mb-2 text-[#c75c5c] flex items-center gap-1.5 uppercase tracking-widest">
                  <AlertTriangle size={12} /> Warnings
                </h3>
                <ul className="space-y-1.5">
                  {warnings.map((w, i) => (
                    <li key={i} className="text-xs font-body text-[#c75c5c]/80 flex items-start gap-1.5">
                      <Shield size={10} className="mt-0.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save & Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-4">
              <Button
                onClick={() => navigate('menu')}
                variant="outline"
                size="sm"
                className="w-full font-body border-[#d4c4a8] text-[#8a7a6a] hover:text-[#c17f59] hover:border-[#c17f59]/40"
              >
                <Save className="mr-2" size={14} />
                Save & Return to Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
