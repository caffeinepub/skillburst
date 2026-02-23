import { TrendingUp } from 'lucide-react';
import { calculateLevel } from '../utils/gamification';

interface XPDisplayProps {
  xp: number;
}

export default function XPDisplay({ xp }: XPDisplayProps) {
  const levelInfo = calculateLevel(xp);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Skill Level</h3>
          <p className="text-3xl font-bold text-gradient">{levelInfo.level}</p>
        </div>
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow-md">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{xp} XP</span>
          <span>{levelInfo.level === 'Master' ? 'Max Level' : `${levelInfo.nextLevelXP} XP`}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
