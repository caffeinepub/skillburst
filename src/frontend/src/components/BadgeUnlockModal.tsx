import { Award, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { AVAILABLE_BADGES } from '../utils/gamification';

interface BadgeUnlockModalProps {
  badgeId: string;
  onClose: () => void;
}

export default function BadgeUnlockModal({ badgeId, onClose }: BadgeUnlockModalProps) {
  const badge = AVAILABLE_BADGES.find((b) => b.id === badgeId);

  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-12 max-w-md mx-4 text-center animate-bounce-in">
        <div className="w-32 h-32 mx-auto mb-6 animate-float">
          <img
            src={badge.icon}
            alt={badge.name}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-warning" />
          <h2 className="text-3xl font-bold text-gradient">Badge Unlocked!</h2>
          <Sparkles className="w-6 h-6 text-warning" />
        </div>

        <h3 className="text-2xl font-bold mb-3">{badge.name}</h3>
        <p className="text-muted-foreground mb-6">{badge.description}</p>

        <button
          onClick={onClose}
          className="px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
