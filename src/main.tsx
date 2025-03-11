
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

// Definindo props padrão para HomePage se necessário
const defaultCrystalParams = {
  size: 4,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  color: '#9b59b6',
  intensity: 1.5,
  speed: 1,
};

const defaultGalleryImages = [
  { id: '1', src: '/placeholder.svg', alt: 'Placeholder 1' },
  { id: '2', src: '/placeholder.svg', alt: 'Placeholder 2' },
  { id: '3', src: '/placeholder.svg', alt: 'Placeholder 3' },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage crystalParams={defaultCrystalParams} galleryImages={defaultGalleryImages} />,
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
