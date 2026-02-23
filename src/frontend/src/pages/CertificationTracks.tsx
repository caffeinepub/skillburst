import { useGetAllLessons, useGetUserProgress, useGenerateCertificate } from '../hooks/useQueries';
import { Trophy, CheckCircle, Lock } from 'lucide-react';
import { useMemo } from 'react';

export default function CertificationTracks() {
  const { data: lessons = [] } = useGetAllLessons();
  const { data: progress } = useGetUserProgress();
  const generateCert = useGenerateCertificate();

  const tracks = useMemo(() => {
    const categories = ['Design', 'Programming', 'Business', 'Creative Arts'];
    
    return categories.map((category) => {
      const categoryLessons = lessons.filter((l) => l.category === category);
      const completedInCategory = categoryLessons.filter((l) =>
        progress?.completedLessons.some((id) => id === l.id)
      );
      const isComplete = categoryLessons.length > 0 && completedInCategory.length === categoryLessons.length;
      
      return {
        category,
        total: categoryLessons.length,
        completed: completedInCategory.length,
        isComplete,
      };
    });
  }, [lessons, progress]);

  const handleGenerateCertificate = async (category: string) => {
    await generateCert.mutateAsync(category);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Certification Tracks</h1>
          <p className="text-lg text-muted-foreground">
            Complete all lessons in a track to earn a verified certificate
          </p>
        </div>

        <div className="space-y-6">
          {tracks.map((track) => (
            <div
              key={track.category}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-glow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{track.category}</h3>
                  <p className="text-muted-foreground">
                    {track.completed} of {track.total} lessons completed
                  </p>
                </div>
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  track.isComplete ? 'gradient-success' : 'bg-muted'
                }`}>
                  {track.isComplete ? (
                    <Trophy className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all duration-500"
                    style={{ width: `${track.total > 0 ? (track.completed / track.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {track.isComplete ? (
                <button
                  onClick={() => handleGenerateCertificate(track.category)}
                  disabled={generateCert.isPending}
                  className="w-full py-3 rounded-lg gradient-success text-white font-medium hover:shadow-glow-md transition-all disabled:opacity-50"
                >
                  {generateCert.isPending ? 'Generating...' : 'Generate Certificate'}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete all lessons to unlock certificate</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
