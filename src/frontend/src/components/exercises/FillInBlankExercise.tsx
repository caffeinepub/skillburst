import { useState } from 'react';
import type { InteractiveExercise } from '../../backend';
import FeedbackDisplay from '../FeedbackDisplay';

interface FillInBlankExerciseProps {
  exercise: InteractiveExercise;
  onComplete: (correct: boolean) => void;
}

export default function FillInBlankExercise({ exercise, onComplete }: FillInBlankExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    const correct = answer.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>
        
        <input
          type="text"
          value={answer}
          onChange={(e) => !submitted && setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer here..."
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
            submitted
              ? isCorrect
                ? 'border-success bg-success/10'
                : 'border-destructive bg-destructive/10'
              : 'border-border bg-background focus:border-primary focus:outline-none'
          } disabled:cursor-not-allowed`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !submitted) {
              handleSubmit();
            }
          }}
        />
        
        {submitted && !isCorrect && (
          <p className="mt-2 text-sm text-muted-foreground">
            Correct answer: <span className="font-medium text-success">{exercise.correctAnswer}</span>
          </p>
        )}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="w-full py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      ) : (
        <FeedbackDisplay
          isCorrect={isCorrect}
          explanation={exercise.explanation}
        />
      )}
    </div>
  );
}
