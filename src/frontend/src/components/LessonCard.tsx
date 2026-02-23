import { Link } from '@tanstack/react-router';
import { Clock, BookOpen, TrendingUp } from 'lucide-react';
import type { Lesson, UserProgressView } from '../backend';

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserProgressView | null;
}

export default function LessonCard({ lesson, progress }: LessonCardProps) {
  const isCompleted = progress?.completedLessons.some((id) => id === lesson.id) || false;
  const currentSegmentMap = new Map(progress?.currentSegment || []);
  const currentSegment = currentSegmentMap.get(lesson.id) || 0n;
  const progressPercent = isCompleted ? 100 : Number(currentSegment) > 0 ? (Number(currentSegment) / lesson.segments.length) * 100 : 0;

  const difficultyColors = {
    Beginner: 'bg-success/10 text-success border-success/20',
    Intermediate: 'bg-warning/10 text-warning border-warning/20',
    Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const categoryGradients = {
    Design: 'from-accent/20 to-accent/5',
    Programming: 'from-secondary/20 to-secondary/5',
    Business: 'from-primary/20 to-primary/5',
    'Creative Arts': 'from-chart-4/20 to-chart-4/5',
  };

  return (
    <Link
      to="/lesson/$lessonId"
      params={{ lessonId: lesson.id.toString() }}
      className="group block"
    >
      <div className="h-full rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-glow-md hover:scale-[1.02] hover:border-primary/50">
        {/* Category Banner */}
        <div className={`h-2 bg-gradient-to-r ${categoryGradients[lesson.category as keyof typeof categoryGradients] || 'from-primary/20 to-primary/5'}`} />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">{lesson.category}</span>
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                    ✓ Completed
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Number(lesson.estimatedTime)} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.segments.length} segments</span>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[lesson.difficulty as keyof typeof difficultyColors] || difficultyColors.Beginner}`}>
              <TrendingUp className="w-3 h-3" />
              {lesson.difficulty}
            </span>
          </div>

          {/* Progress Bar */}
          {progressPercent > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
