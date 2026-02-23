import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lesson, UserProgressView, Certificate, UserProfile } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save profile');
      console.error('Profile save error:', error);
    },
  });
}

// Lesson Queries
export function useGetAllLessons() {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLessonsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessonsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

// User Progress Queries
export function useGetUserProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProgressView | null>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, segment, isComplete }: { lessonId: bigint; segment: bigint; isComplete: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProgress(lessonId, segment, isComplete);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
    onError: (error) => {
      toast.error('Failed to update progress');
      console.error('Progress update error:', error);
    },
  });
}

// Certificate Queries
export function useGenerateCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateCertificate(skill);
    },
    onSuccess: (certificate) => {
      if (certificate) {
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
        toast.success('Certificate generated successfully!');
      } else {
        toast.error('Complete all lessons in this track to earn a certificate');
      }
    },
    onError: (error) => {
      toast.error('Failed to generate certificate');
      console.error('Certificate generation error:', error);
    },
  });
}

export function useVerifyCertificate(verificationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Certificate | null>({
    queryKey: ['certificate', verificationId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.verifyCertificate(verificationId);
    },
    enabled: !!actor && !isFetching && !!verificationId,
  });
}
