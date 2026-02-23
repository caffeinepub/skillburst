import { useState } from 'react';
import type { InteractiveExercise } from '../../backend';
import FeedbackDisplay from '../FeedbackDisplay';

interface MultipleChoiceExerciseProps {
  exercise: InteractiveExercise;
  onComplete: (correct: boolean) => void;
}

export default function MultipleChoiceExercise({ exercise, onComplete }: MultipleChoiceExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === exercise.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>
        
        <div className="space-y-3">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !submitted && setSelectedOption(option)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                submitted
                  ? option === exercise.correctAnswer
                    ? 'border-success bg-success/10'
                    : option === selectedOption
                    ? 'border-destructive bg-destructive/10'
                    : 'border-border bg-background'
                  : selectedOption === option
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              } disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  submitted
                    ? option === exercise.correctAnswer
                      ? 'border-success bg-success'
                      : option === selectedOption
                      ? 'border-destructive bg-destructive'
                      : 'border-border'
                    : selectedOption === option
                    ? 'border-primary bg-primary'
                    : 'border-border'
                }`}>
                  {submitted && option === exercise.correctAnswer && (
                    <span className="text-white text-sm">✓</span>
                  )}
                  {submitted && option === selectedOption && option !== exercise.correctAnswer && (
                    <span className="text-white text-sm">✗</span>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
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
