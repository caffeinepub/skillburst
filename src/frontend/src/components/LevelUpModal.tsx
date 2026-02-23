import { Trophy, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SkillLevel } from '../utils/gamification';

interface LevelUpModalProps {
  newLevel: SkillLevel;
  onClose: () => void;
}

export default function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setConfetti(pieces);

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            background: `oklch(${0.6 + Math.random() * 0.2} ${0.15 + Math.random() * 0.1} ${Math.random() * 360})`,
          }}
        />
      ))}

      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-12 max-w-md mx-4 text-center animate-bounce-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-glow-lg animate-pulse-glow">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-warning" />
          <h2 className="text-3xl font-bold text-gradient">Level Up!</h2>
          <Sparkles className="w-6 h-6 text-warning" />
        </div>

        <p className="text-xl text-muted-foreground mb-6">
          You've reached
        </p>

        <div className="text-5xl font-bold mb-6 text-gradient">
          {newLevel}
        </div>

        <p className="text-muted-foreground">
          Keep learning to unlock more achievements!
        </p>

        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}
