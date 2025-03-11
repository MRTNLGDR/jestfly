
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import HomePage from '@/pages/HomePage';
import CommunityPage from '@/pages/CommunityPage';
import BookingsPage from '@/pages/BookingsPage';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPanel from '@/pages/AdminPanel';

// Define os params padrão para a HomePage
const defaultHomePageProps = {
  crystalParams: {
    size: 4,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    color: '#9b59b6',
    intensity: 1.5,
    speed: 1,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    ior: 2.33,
    attenuationColor: '#ffffff',
    attenuationDistance: 0,
    reflectivity: 0.5,
    iridescence: 1,
    iridescenceIOR: 1.5,
    sheen: 0,
    sheenRoughness: 0.1,
    sheenColor: '#ffffff',
    specularIntensity: 1,
    specularColor: '#ffffff',
    lightIntensity: 1,
    opacity: 1,
    transparent: true,
    textureMap: '',
    normalMap: '',
    roughnessMap: '',
    metalnessMap: '',
    emissiveMap: '',
    emissiveColor: '#000000',
    emissiveIntensity: 0,
    aoMap: '',
    aoMapIntensity: 1,
    displacementMap: '',
    displacementScale: 1,
    displacementBias: 0,
    wireframe: false,
    side: "front" as const,
  },
  galleryImages: [
    { src: '/placeholder.svg', alt: 'Placeholder 1', crystalPosition: "default" as const },
    { src: '/placeholder.svg', alt: 'Placeholder 2', crystalPosition: "top-left" as const },
    { src: '/placeholder.svg', alt: 'Placeholder 3', crystalPosition: "center" as const },
  ],
};

// Criando o queryClient para o React Query
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage {...defaultHomePageProps} />,
      },
      {
        path: "community/*",
        element: <CommunityPage />,
      },
      {
        path: "bookings",
        element: <BookingsPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
