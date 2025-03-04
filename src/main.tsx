import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import NotFound from './pages/NotFound.tsx';
import LogsPage from './pages/LogsPage.tsx';
import LogsViewer from './pages/LogsViewer.tsx';
import BookingsPage from './pages/BookingsPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/logs",
    element: <LogsPage />,
  },
  {
    path: "/logs/:resourceType/:resourceId",
    element: <LogsViewer />,
  },
  {
    path: "/bookings",
    element: <BookingsPage />,
  },
  // Other routes...
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
