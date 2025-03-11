
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import HomePage from '@/pages/HomePage';
import CommunityPage from '@/pages/CommunityPage';
// import StorePage from '@/pages/StorePage';
// import ProductDetailPage from '@/pages/ProductDetailPage';
// import CheckoutPage from '@/pages/CheckoutPage';
// import LoginPage from '@/pages/LoginPage';
// import RegistrationPage from '@/pages/RegistrationPage';
// import ProfilePage from '@/pages/ProfilePage';
// import EditProfilePage from '@/pages/EditProfilePage';
// import ContactPage from '@/pages/ContactPage';
// import AboutPage from '@/pages/AboutPage';

// Definindo props padrão para HomePage
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
  },
  galleryImages: [
    { src: '/placeholder.svg', alt: 'Placeholder 1', crystalPosition: 'default' },
    { src: '/placeholder.svg', alt: 'Placeholder 2', crystalPosition: 'top-left' },
    { src: '/placeholder.svg', alt: 'Placeholder 3', crystalPosition: 'center' },
  ],
};

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
      // {
      //   path: "store",
      //   element: <StorePage />,
      // },
      // {
      //   path: "store/product/:productId",
      //   element: <ProductDetailPage />,
      // },
      // {
      //   path: "checkout",
      //   element: <CheckoutPage />,
      // },
      // {
      //   path: "login",
      //   element: <LoginPage />,
      // },
      // {
      //   path: "register",
      //   element: <RegistrationPage />,
      // },
      // {
      //   path: "profile",
      //   element: <ProfilePage />,
      // },
      // {
      //   path: "profile/edit",
      //   element: <EditProfilePage />,
      // },
      // {
      //   path: "contact",
      //   element: <ContactPage />,
      // },
      // {
      //   path: "about",
      //   element: <AboutPage />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
