import { useState } from 'react';
import type { InteractiveExercise } from '../../backend';
import FeedbackDisplay from '../FeedbackDisplay';
import { GripVertical } from 'lucide-react';

interface DragDropExerciseProps {
  exercise: InteractiveExercise;
  onComplete: (correct: boolean) => void;
}

export default function DragDropExercise({ exercise, onComplete }: DragDropExerciseProps) {
  const [items, setItems] = useState(exercise.options);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    const correct = items[0] === exercise.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-4">{exercise.question}</h3>
        <p className="text-sm text-muted-foreground mb-4">Drag items to reorder them</p>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              draggable={!submitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                submitted
                  ? index === 0 && item === exercise.correctAnswer
                    ? 'border-success bg-success/10'
                    : 'border-border bg-background'
                  : 'border-border bg-background hover:border-primary/50 cursor-move'
              }`}
            >
              {!submitted && <GripVertical className="w-5 h-5 text-muted-foreground" />}
              <span className="flex-1">{item}</span>
              {submitted && index === 0 && item === exercise.correctAnswer && (
                <span className="text-success">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all"
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
