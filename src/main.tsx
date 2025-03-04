
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import NotFound from './pages/NotFound.tsx';
import LogsPage from './pages/LogsPage.tsx';
import LogsViewer from './pages/LogsViewer.tsx';
import BookingsPage from './pages/BookingsPage.tsx';
import HomePage from './pages/HomePage.tsx';
import StorePage from './pages/StorePage.tsx';
import CommunityPage from './pages/CommunityPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import DemoSubmissionPage from './pages/DemoSubmissionPage.tsx';
import LiveStreamPage from './pages/LiveStreamPage.tsx';
import PressKitPage from './pages/PressKitPage.tsx';
import AirdropPage from './pages/AirdropPage.tsx';
import AdminPanel from './pages/AdminPanel.tsx';
import AuthPage from './pages/AuthPage.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import LanguageProvider from './contexts/LanguageContext.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import { Toaster } from '@/components/ui/toaster';
import { defaultModelParams } from './types/model';

// Default gallery images for HomePage
const galleryImages = [
  {
    src: "/placeholder.svg",
    alt: "Gallery Image 1",
    crystalPosition: 'top-right' as const
  },
  {
    src: "/placeholder.svg",
    alt: "Gallery Image 2",
    crystalPosition: 'bottom-left' as const
  },
  {
    src: "/placeholder.svg",
    alt: "Gallery Image 3",
    crystalPosition: 'center' as const
  }
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage 
      crystalParams={{
        ...defaultModelParams,
        color: "#ffffff",
        metalness: 0.2,
        roughness: 0.01,
        transmission: 0.98,
        thickness: 0.8,
        envMapIntensity: 5.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        ior: 2.5,
        iridescence: 1.0,
        iridescenceIOR: 2.0,
        transparent: true,
        opacity: 0.8,
        reflectivity: 1.0,
        emissiveIntensity: 0.08,
        emissiveColor: "#8B5CF6",
        lightIntensity: 5.0
      }}
      galleryImages={galleryImages}
    />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/store/*",
    element: <StorePage />,
  },
  {
    path: "/community/*",
    element: <CommunityPage />,
  },
  {
    path: "/bookings",
    element: <BookingsPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/demo-submission",
    element: (
      <ProtectedRoute allowedProfiles={['artist', 'collaborator']}>
        <DemoSubmissionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/live-stream",
    element: <LiveStreamPage />,
  },
  {
    path: "/press-kit",
    element: <PressKitPage />,
  },
  {
    path: "/airdrop",
    element: (
      <ProtectedRoute>
        <AirdropPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedProfiles={['admin']}>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logs",
    element: <LogsPage />,
  },
  {
    path: "/logs/:resourceType/:resourceId",
    element: <LogsViewer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </LanguageProvider>
);
