import { AVAILABLE_BADGES } from '../utils/gamification';
import { Lock } from 'lucide-react';

interface BadgeCollectionProps {
  earnedBadges: string[];
}

export default function BadgeCollection({ earnedBadges }: BadgeCollectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {AVAILABLE_BADGES.map((badge) => {
        const isEarned = earnedBadges.includes(badge.id);
        
        return (
          <div
            key={badge.id}
            className={`p-6 rounded-2xl border text-center transition-all ${
              isEarned
                ? 'bg-card border-primary/50 shadow-glow-sm hover:shadow-glow-md'
                : 'bg-muted/50 border-border opacity-60'
            }`}
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              <img
                src={badge.icon}
                alt={badge.name}
                className={`w-full h-full object-contain ${isEarned ? '' : 'grayscale opacity-50'}`}
              />
              {!isEarned && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <h4 className="font-semibold mb-1 text-sm">{badge.name}</h4>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
