import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LessonCatalog from './pages/LessonCatalog';
import LessonPlayer from './pages/LessonPlayer';
import ProfilePage from './pages/ProfilePage';
import CertificationTracks from './pages/CertificationTracks';
import CertificateView from './pages/CertificateView';
import CertificateVerification from './pages/CertificateVerification';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from 'sonner';

function RootComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LessonCatalog,
});

const lessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons',
  component: LessonCatalog,
});

const lessonPlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lesson/$lessonId',
  component: LessonPlayer,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certifications',
  component: CertificationTracks,
});

const certificateViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certificate/$id',
  component: CertificateView,
});

const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify',
  component: CertificateVerification,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  lessonsRoute,
  lessonPlayerRoute,
  profileRoute,
  certificationsRoute,
  certificateViewRoute,
  verifyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && (
        <ProfileSetupModal
          onComplete={() => setShowProfileSetup(false)}
        />
      )}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
