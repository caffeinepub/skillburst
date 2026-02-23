import { useState, useMemo } from 'react';
import { useGetAllLessons, useGetUserProgress } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LessonCard from '../components/LessonCard';
import { BookOpen, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Design', 'Programming', 'Business', 'Creative Arts'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function LessonCatalog() {
  const { identity } = useInternetIdentity();
  const { data: lessons = [], isLoading } = useGetAllLessons();
  const { data: progress } = useGetUserProgress();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const isAuthenticated = !!identity;

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const categoryMatch = selectedCategory === 'All' || lesson.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [lessons, selectedCategory, selectedDifficulty]);

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="/assets/generated/hero-learning.dim_1200x600.png"
              alt="Start Learning"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            Master New Skills in Minutes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bite-sized interactive lessons designed for your busy life. Learn, practice, and earn real certifications.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="px-6 py-3 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-primary">5-15 min</div>
              <div className="text-sm text-muted-foreground">Per Lesson</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-secondary">Interactive</div>
              <div className="text-sm text-muted-foreground">Exercises</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-card border border-border">
              <div className="text-2xl font-bold text-accent">Certified</div>
              <div className="text-sm text-muted-foreground">On Blockchain</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          Your Learning Journey
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose from bite-sized lessons across multiple categories. Each lesson takes just 5-15 minutes!
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filter by:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'gradient-primary text-white shadow-glow-sm'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? 'gradient-secondary text-white shadow-glow-sm'
                    : 'bg-card border border-border hover:border-secondary/50'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="text-center py-16">
          <img
            src="/assets/generated/empty-lessons.dim_400x400.png"
            alt="No lessons"
            className="w-64 h-64 mx-auto mb-6 opacity-50"
          />
          <h3 className="text-2xl font-bold mb-2">No lessons found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id.toString()}
              lesson={lesson}
              progress={progress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
