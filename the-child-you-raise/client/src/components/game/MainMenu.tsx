/*
 * Design: Storybook Realism — Main Menu
 * Hero image with warm watercolor overlay, centered card layout
 * Dark text on light overlay for readability
 */
import { useGame } from '../../contexts/GameContext';
import { getSaveInfo } from '../../engine/saveEngine';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, RotateCcw } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663246257081/DcHQtw6S3jhQaKpMcDmZWt/hero-main-c98GprjJ9KqPJRBGfKpYhk.webp';

export default function MainMenu() {
  const { navigate, loadSavedGame } = useGame();
  const saveInfo = getSaveInfo();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/60 via-[#faf6f0]/40 to-[#faf6f0]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sm font-body text-[#5a4a3a]/70 mb-4 tracking-widest uppercase">
              <BookOpen size={14} />
              <span>A Life Simulation</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-[#3a2e24] mb-4 tracking-tight leading-[1.1]">
              The Child<br />You Raise
            </h1>
            <p className="font-accent text-xl sm:text-2xl text-[#6b5744]">
              Every choice shapes a life
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#d4c4a8]/40 p-8 space-y-4">
            <Button
              onClick={() => navigate('newgame')}
              className="w-full h-14 text-lg font-body font-semibold bg-[#c17f59] hover:bg-[#a86b48] text-white shadow-md"
            >
              <Play className="mr-2" size={18} />
              New Game
            </Button>

            {saveInfo.exists && (
              <Button
                onClick={loadSavedGame}
                variant="outline"
                className="w-full h-14 text-lg font-body font-semibold border-2 border-[#c17f59]/30 text-[#6b5744] hover:bg-[#c17f59]/10"
              >
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-2">
                    <RotateCcw size={16} />
                    Continue Game
                  </span>
                  <span className="text-xs text-[#8a7a6a] font-normal mt-0.5">
                    {saveInfo.childName} — Age {saveInfo.age}
                  </span>
                </div>
              </Button>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#6b5744]/60 mt-8 font-body leading-relaxed">
            A parenting simulation inspired by Crusader Kings III, The Sims, and BitLife.
            <br />
            Raise your child from birth to adulthood. Your choices matter.
          </p>
        </div>
      </div>
    </div>
  );
}
