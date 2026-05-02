/*
 * Design: Storybook Realism — Event Card
 * CK3-style event card with category badges, choice buttons with hover effects
 */
import { useGame } from '../../contexts/GameContext';
import type { GameEvent, EventChoice } from '../../engine/types';
import { ChevronRight } from 'lucide-react';

interface EventCardProps {
  event: GameEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { makeChoice } = useGame();

  const handleChoice = (choice: EventChoice) => {
    makeChoice(choice, event);
  };

  const categoryStyles: Record<string, { bg: string; text: string; icon: string }> = {
    parenting: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: '👶' },
    development: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-800', icon: '🌱' },
    behavior: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', icon: '⚡' },
    health: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: '💚' },
    social: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', icon: '👥' },
    household: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800', icon: '🏠' },
    academics: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: '📖' },
    emotional: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', icon: '💜' },
    risk: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: '⚠️' },
    milestone: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon: '⭐' },
    technology: { bg: 'bg-cyan-50 border-cyan-200', text: 'text-cyan-800', icon: '💻' },
    identity: { bg: 'bg-pink-50 border-pink-200', text: 'text-pink-800', icon: '🪞' },
    family: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', icon: '👨‍👩‍👧' },
    education: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800', icon: '🎓' },
    career: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800', icon: '💼' },
  };

  const style = categoryStyles[event.category] || { bg: 'bg-muted border-border', text: 'text-muted-foreground', icon: '📋' };

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#e8ddd0] overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${style.bg} ${style.text}`}>
            <span>{style.icon}</span>
            {event.category}
          </span>
        </div>
        <h3 className="font-display text-2xl font-bold text-[#3a2e24] mb-3 leading-tight">
          {event.title}
        </h3>
        <p className="font-body text-[#5a4a3a]/85 leading-relaxed text-[15px]">
          {event.description}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-dashed border-[#d4c4a8]/60" />

      {/* Choices */}
      <div className="p-4 space-y-2">
        {event.choices.map((choice, idx) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            className="w-full text-left px-4 py-3.5 rounded-lg border-2 border-[#e8ddd0] hover:border-[#c17f59]/60 hover:bg-[#faf6f0] transition-all duration-200 font-body text-sm leading-snug group flex items-center gap-3"
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#f5efe6] border border-[#d4c4a8] flex items-center justify-center text-xs font-semibold text-[#8a7a6a] group-hover:bg-[#c17f59] group-hover:text-white group-hover:border-[#c17f59] transition-all">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-[#3a2e24] group-hover:text-[#c17f59] transition-colors font-medium flex-1">
              {choice.text}
            </span>
            <ChevronRight size={14} className="text-[#d4c4a8] group-hover:text-[#c17f59] transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
