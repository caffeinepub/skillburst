import { useGetUserProgress, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import ProfileStatistics from '../components/ProfileStatistics';
import BadgeCollection from '../components/BadgeCollection';
import XPDisplay from '../components/XPDisplay';
import StreakDisplay from '../components/StreakDisplay';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: progress, isLoading: progressLoading } = useGetUserProgress();
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (!identity) {
    navigate({ to: '/' });
    return null;
  }

  if (progressLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8 p-8 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow-md">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile?.name || 'Learner'}</h1>
              <p className="text-muted-foreground">{profile?.email || 'Keep learning and growing!'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <XPDisplay xp={Number(progress?.xp || 0)} />
          <StreakDisplay streak={Number(progress?.streak || 0)} />
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <ProfileStatistics progress={progress} />
        </div>

        {/* Badge Collection */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Achievement Badges</h2>
          <BadgeCollection earnedBadges={progress?.badges || []} />
        </div>
      </div>
    </div>
  );
}
