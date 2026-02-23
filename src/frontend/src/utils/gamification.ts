export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export interface LevelInfo {
  level: SkillLevel;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

const LEVEL_THRESHOLDS = {
  Beginner: 0,
  Intermediate: 500,
  Advanced: 1500,
  Expert: 3000,
  Master: 5000,
};

export function calculateLevel(xp: number): LevelInfo {
  let level: SkillLevel = 'Beginner';
  let nextLevelXP = LEVEL_THRESHOLDS.Intermediate;

  if (xp >= LEVEL_THRESHOLDS.Master) {
    level = 'Master';
    nextLevelXP = LEVEL_THRESHOLDS.Master;
  } else if (xp >= LEVEL_THRESHOLDS.Expert) {
    level = 'Expert';
    nextLevelXP = LEVEL_THRESHOLDS.Master;
  } else if (xp >= LEVEL_THRESHOLDS.Advanced) {
    level = 'Advanced';
    nextLevelXP = LEVEL_THRESHOLDS.Expert;
  } else if (xp >= LEVEL_THRESHOLDS.Intermediate) {
    level = 'Intermediate';
    nextLevelXP = LEVEL_THRESHOLDS.Advanced;
  }

  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const progress = level === 'Master' ? 100 : ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return {
    level,
    currentXP: xp,
    nextLevelXP,
    progress: Math.min(progress, 100),
  };
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const AVAILABLE_BADGES: BadgeDefinition[] = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '/assets/generated/badge-first-lesson.dim_256x256.png',
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '/assets/generated/badge-week-streak.dim_256x256.png',
  },
  {
    id: 'perfect-score',
    name: 'Perfectionist',
    description: 'Complete a lesson with 100% accuracy',
    icon: '/assets/generated/badge-perfect-score.dim_256x256.png',
  },
  {
    id: 'speed-learner',
    name: 'Speed Learner',
    description: 'Complete 5 lessons in one day',
    icon: '/assets/generated/badge-perfect-score.dim_256x256.png',
  },
  {
    id: 'category-master',
    name: 'Category Master',
    description: 'Complete all lessons in a category',
    icon: '/assets/generated/badge-first-lesson.dim_256x256.png',
  },
];

export function checkBadgeEligibility(
  badgeId: string,
  completedLessons: number,
  streak: number,
  earnedBadges: string[]
): boolean {
  if (earnedBadges.includes(badgeId)) return false;

  switch (badgeId) {
    case 'first-lesson':
      return completedLessons >= 1;
    case 'week-streak':
      return streak >= 7;
    case 'perfect-score':
      return false; // Checked during lesson completion
    case 'speed-learner':
      return false; // Requires time-based tracking
    case 'category-master':
      return false; // Requires category completion tracking
    default:
      return false;
  }
}

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}

export function formatStreak(streak: number): string {
  if (streak === 0) return 'Start your streak!';
  if (streak === 1) return '1 day';
  return `${streak} days`;
}
