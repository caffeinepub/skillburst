import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllLessons, useUpdateProgress, useGetUserProgress } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import MultipleChoiceExercise from '../components/exercises/MultipleChoiceExercise';
import DragDropExercise from '../components/exercises/DragDropExercise';
import FillInBlankExercise from '../components/exercises/FillInBlankExercise';
import SegmentSummary from '../components/SegmentSummary';
import LevelUpModal from '../components/LevelUpModal';
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import { calculateLevel, checkBadgeEligibility, AVAILABLE_BADGES } from '../utils/gamification';

export default function LessonPlayer() {
  const { lessonId } = useParams({ from: '/lesson/$lessonId' });
  const navigate = useNavigate();
  const { data: lessons = [] } = useGetAllLessons();
  const { data: progress } = useGetUserProgress();
  const updateProgress = useUpdateProgress();

  const lesson = lessons.find((l) => l.id.toString() === lessonId);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [exerciseCorrect, setExerciseCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [segmentAccuracy, setSegmentAccuracy] = useState(100);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [newBadge, setNewBadge] = useState<string>('');
  const [previousLevel, setPreviousLevel] = useState<string>('');

  useEffect(() => {
    if (lesson && progress) {
      const currentSegmentMap = new Map(progress.currentSegment || []);
      const savedSegment = currentSegmentMap.get(lesson.id);
      if (savedSegment !== undefined) {
        setCurrentSegmentIndex(Number(savedSegment));
      }
    }
  }, [lesson, progress]);

  if (!lesson) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
        <button
          onClick={() => navigate({ to: '/lessons' })}
          className="px-6 py-3 rounded-lg gradient-primary text-white font-medium"
        >
          Back to Lessons
        </button>
      </div>
    );
  }

  const currentSegment = lesson.segments[currentSegmentIndex];
  const isLastSegment = currentSegmentIndex === lesson.segments.length - 1;
  const hasExercise = !!currentSegment.exercise;

  const handleExerciseComplete = (correct: boolean) => {
    setExerciseCompleted(true);
    setExerciseCorrect(correct);
    setSegmentAccuracy(correct ? 100 : 0);
  };

  const handleNextSegment = async () => {
    if (hasExercise && !exerciseCompleted) return;

    // Save progress
    const isComplete = isLastSegment;
    await updateProgress.mutateAsync({
      lessonId: lesson.id,
      segment: BigInt(currentSegmentIndex + 1),
      isComplete,
    });

    // Check for level up
    if (isComplete && progress) {
      const oldLevel = calculateLevel(Number(progress.xp));
      const newXP = Number(progress.xp) + 100;
      const newLevel = calculateLevel(newXP);
      
      if (oldLevel.level !== newLevel.level) {
        setPreviousLevel(oldLevel.level);
        setShowLevelUp(true);
      }

      // Check for badge unlock
      const completedCount = progress.completedLessons.length + 1;
      const streak = Number(progress.streak);
      const earnedBadges = progress.badges;

      for (const badge of AVAILABLE_BADGES) {
        if (checkBadgeEligibility(badge.id, completedCount, streak, earnedBadges)) {
          setNewBadge(badge.id);
          setShowBadgeUnlock(true);
          break;
        }
      }
    }

    if (isLastSegment) {
      setShowSummary(true);
    } else {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setExerciseCompleted(false);
      setExerciseCorrect(false);
    }
  };

  const handlePreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      setExerciseCompleted(false);
      setExerciseCorrect(false);
    }
  };

  const handleFinishLesson = () => {
    navigate({ to: '/lessons' });
  };

  if (showSummary) {
    return (
      <SegmentSummary
        accuracy={segmentAccuracy}
        onContinue={handleFinishLesson}
        isLastSegment={true}
      />
    );
  }

  return (
    <>
      <div className="container max-w-4xl py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate({ to: '/lessons' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Lessons
            </button>
            <span className="text-sm text-muted-foreground">
              Segment {currentSegmentIndex + 1} of {lesson.segments.length}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
          
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${((currentSegmentIndex + 1) / lesson.segments.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-8 mb-6 animate-slide-up">
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed">{currentSegment.content}</p>
          </div>

          {/* Exercise */}
          {hasExercise && currentSegment.exercise && (
            <div className="mt-8">
              {currentSegment.exercise.options.length > 2 ? (
                <MultipleChoiceExercise
                  exercise={currentSegment.exercise}
                  onComplete={handleExerciseComplete}
                />
              ) : currentSegment.exercise.question.toLowerCase().includes('drag') ? (
                <DragDropExercise
                  exercise={currentSegment.exercise}
                  onComplete={handleExerciseComplete}
                />
              ) : (
                <FillInBlankExercise
                  exercise={currentSegment.exercise}
                  onComplete={handleExerciseComplete}
                />
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousSegment}
            disabled={currentSegmentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNextSegment}
            disabled={hasExercise && !exerciseCompleted}
            className="flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-white font-medium hover:shadow-glow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastSegment ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Lesson
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {showLevelUp && (
        <LevelUpModal
          newLevel={calculateLevel(Number(progress?.xp || 0) + 100).level}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {showBadgeUnlock && (
        <BadgeUnlockModal
          badgeId={newBadge}
          onClose={() => setShowBadgeUnlock(false)}
        />
      )}
    </>
  );
}
