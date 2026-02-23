import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface FeedbackDisplayProps {
  isCorrect: boolean;
  explanation: string;
}

export default function FeedbackDisplay({ isCorrect, explanation }: FeedbackDisplayProps) {
  return (
    <div className={`p-6 rounded-xl border-2 animate-bounce-in ${
      isCorrect
        ? 'bg-success/10 border-success'
        : 'bg-destructive/10 border-destructive'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-success' : 'bg-destructive'
        }`}>
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <XCircle className="w-6 h-6 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-lg font-bold mb-2 ${
            isCorrect ? 'text-success' : 'text-destructive'
          }`}>
            {isCorrect ? '🎉 Excellent!' : '💪 Keep Learning!'}
          </h4>
          
          <p className="text-foreground mb-3">
            {isCorrect
              ? 'Great job! You got it right.'
              : 'Not quite, but that\'s okay! Learning is a journey.'}
          </p>
          
          {explanation && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50">
              <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
