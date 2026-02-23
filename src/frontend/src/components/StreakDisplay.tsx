import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Learning Streak</h3>
          <p className="text-3xl font-bold text-gradient">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {streak === 0 ? 'Start your streak today!' : 'Keep it going!'}
          </p>
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          streak > 0 ? 'gradient-primary animate-pulse-glow' : 'bg-muted'
        }`}>
          <Flame className={`w-8 h-8 ${streak > 0 ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
      </div>
    </div>
  );
}
