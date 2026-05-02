/*
 * Design: Storybook Realism — Household
 * Financial overview with stat bars for living conditions
 */
import { useGame } from '../../contexts/GameContext';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Home, Shield, Utensils, Car, Users, Clock } from 'lucide-react';

export default function Household() {
  const { state, navigate } = useGame();
  const { gameState } = state;
  if (!gameState) return null;

  const h = gameState.household;
  const netMonthly = h.monthly_income - h.monthly_bills;

  const conditions = [
    { label: 'Housing Quality', value: h.housing_quality, icon: Home },
    { label: 'Neighborhood Safety', value: h.neighborhood_safety, icon: Shield },
    { label: 'Food Security', value: h.food_security, icon: Utensils },
    { label: 'Transportation', value: h.transportation, icon: Car },
    { label: 'Family Stability', value: h.family_stability, icon: Users },
    { label: 'Time Available', value: h.time_available, icon: Clock },
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

        <h2 className="font-display text-3xl font-bold text-[#3a2e24] mb-6">Household</h2>

        {/* Finances */}
        <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] p-6 mb-5">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <DollarSign size={18} className="text-[#c17f59]" /> Finances
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#e8ddd0] text-center">
              <span className="text-xs font-body text-[#8a7a6a] block mb-1">Savings</span>
              <span className="font-mono text-2xl font-bold text-[#3a2e24]">${h.money.toLocaleString()}</span>
            </div>
            <div className="bg-[#faf6f0] rounded-lg p-4 border border-[#e8ddd0] text-center">
              <span className="text-xs font-body text-[#8a7a6a] block mb-1">Debt</span>
              <span className="font-mono text-2xl font-bold text-[#c75c5c]">${h.debt.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-sm font-body">
            <div className="flex justify-between items-center">
              <span className="text-[#8a7a6a] flex items-center gap-2"><TrendingUp size={14} /> Monthly Income</span>
              <span className="font-mono font-semibold text-[#7a9e7e]">${h.monthly_income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8a7a6a] flex items-center gap-2"><TrendingDown size={14} /> Monthly Bills</span>
              <span className="font-mono font-semibold text-[#c75c5c]">${h.monthly_bills.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed border-[#e8ddd0] pt-2.5 mt-2.5">
              <span className="font-semibold text-[#3a2e24]">Net Monthly</span>
              <span className={`font-mono font-bold text-lg ${netMonthly >= 0 ? 'text-[#7a9e7e]' : 'text-[#c75c5c]'}`}>
                {netMonthly >= 0 ? '+' : ''}${netMonthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Living Conditions */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e8ddd0] p-6">
          <h3 className="font-display text-lg font-bold text-[#3a2e24] mb-5 flex items-center gap-2">
            <Home size={18} className="text-[#c17f59]" /> Living Conditions
          </h3>
          <div className="space-y-4">
            {conditions.map(({ label, value, icon: Icon }) => (
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
      </div>
    </div>
  );
}
