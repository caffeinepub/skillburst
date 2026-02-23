import { Trophy, TrendingUp } from 'lucide-react';

interface SegmentSummaryProps {
  accuracy: number;
  onContinue: () => void;
  isLastSegment: boolean;
}

export default function SegmentSummary({ accuracy, onContinue, isLastSegment }: SegmentSummaryProps) {
  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center animate-bounce-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center shadow-glow-lg">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-4xl font-bold mb-4">
          {isLastSegment ? '🎉 Lesson Complete!' : 'Segment Complete!'}
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8">
          {accuracy >= 80
            ? 'Outstanding work! You\'re mastering this!'
            : accuracy >= 60
            ? 'Good effort! Keep practicing!'
            : 'Nice try! Review and try again!'}
        </p>

        <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-3xl font-bold text-primary mb-2">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="text-3xl font-bold text-secondary mb-2">+100</div>
            <div className="text-sm text-muted-foreground">XP Earned</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Keep up the momentum!</span>
        </div>

        <button
          onClick={onContinue}
          className="px-8 py-4 rounded-lg gradient-primary text-white font-medium text-lg hover:shadow-glow-md transition-all"
        >
          {isLastSegment ? 'Back to Lessons' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
