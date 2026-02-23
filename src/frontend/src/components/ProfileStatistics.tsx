import { BookOpen, Target, Zap } from 'lucide-react';
import type { UserProgressView } from '../backend';

interface ProfileStatisticsProps {
  progress: UserProgressView | null | undefined;
}

export default function ProfileStatistics({ progress }: ProfileStatisticsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: progress?.completedLessons.length || 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Zap,
      label: 'Total XP',
      value: Number(progress?.xp || 0),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Target,
      label: 'Current Streak',
      value: `${Number(progress?.streak || 0)} days`,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl bg-card border border-border hover:shadow-glow-sm transition-all"
        >
          <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-3xl font-bold mb-2">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
