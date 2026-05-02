/*
 * Design: Storybook Realism — New Game Screen
 * Warm paper texture, editorial form layout, terracotta accents
 */
import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import type { Difficulty } from '../../engine/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Baby, Feather } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663246257081/DcHQtw6S3jhQaKpMcDmZWt/event-bg-infancy-XQCTFMLWLATYjVZKjYdcTQ.webp';

const difficultyInfo: Record<Difficulty, { label: string; emoji: string; desc: string }> = {
  easy: { label: 'Gentle', emoji: '🌿', desc: 'More resources, lower stress. A forgiving first playthrough.' },
  normal: { label: 'Realistic', emoji: '⚖️', desc: 'Balanced challenge with realistic constraints and tradeoffs.' },
  hard: { label: 'Hardship', emoji: '🌧️', desc: 'Limited resources, high stress. Every decision carries weight.' },
};

export default function NewGame() {
  const { startNewGame, navigate } = useGame();
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const handleStart = () => {
    if (!parentName.trim() || !childName.trim()) return;
    startNewGame(parentName.trim(), childName.trim(), difficulty);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] relative">
      {/* Subtle hero accent */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/30 to-[#faf6f0]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md w-full">
          <button
            onClick={() => navigate('menu')}
            className="flex items-center gap-2 text-[#8a7a6a] hover:text-[#c17f59] mb-8 font-body transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-[#e8ddd0] overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-dashed border-[#e8ddd0]">
              <Baby className="mx-auto mb-3 text-[#c17f59]" size={28} />
              <h2 className="font-display text-3xl font-bold text-[#3a2e24] mb-1">Begin Your Story</h2>
              <p className="font-body text-sm text-[#8a7a6a]">Name your family and choose your path</p>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block font-body font-semibold text-sm mb-2 text-[#5a4a3a]">
                  Your Name (Parent)
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Enter parent name..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#e8ddd0] bg-[#faf6f0]/50 font-body text-[#3a2e24] placeholder:text-[#c4b8a8] focus:outline-none focus:border-[#c17f59] focus:ring-1 focus:ring-[#c17f59]/20 transition-colors"
                  maxLength={24}
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-sm mb-2 text-[#5a4a3a]">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child name..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#e8ddd0] bg-[#faf6f0]/50 font-body text-[#3a2e24] placeholder:text-[#c4b8a8] focus:outline-none focus:border-[#c17f59] focus:ring-1 focus:ring-[#c17f59]/20 transition-colors"
                  maxLength={24}
                />
              </div>

              <div>
                <label className="block font-body font-semibold text-sm mb-3 text-[#5a4a3a]">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => {
                    const info = difficultyInfo[d];
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-3 rounded-lg border-2 font-body text-sm transition-all flex flex-col items-center gap-1 ${
                          difficulty === d
                            ? 'border-[#c17f59] bg-[#c17f59]/10 text-[#c17f59]'
                            : 'border-[#e8ddd0] hover:border-[#c17f59]/40 text-[#8a7a6a]'
                        }`}
                      >
                        <span className="text-lg">{info.emoji}</span>
                        <span className="font-semibold">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#8a7a6a] mt-2.5 font-body text-center italic">
                  {difficultyInfo[difficulty].desc}
                </p>
              </div>

              <Button
                onClick={handleStart}
                disabled={!parentName.trim() || !childName.trim()}
                className="w-full h-14 text-lg font-body font-semibold bg-[#c17f59] hover:bg-[#a86b48] text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Feather className="mr-2" size={18} />
                Start Raising {childName || 'Your Child'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
