import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

// Import all the pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Community from './pages/Community';
import Store from './pages/Store';
import Bookings from './pages/Bookings';
import Demos from './pages/Demos';
import Livestream from './pages/Livestream';
import PressKit from './pages/PressKit';
import CreativeFlow from './pages/CreativeFlow';
import JestCoin from './pages/JestCoin';
import Airdrop from './pages/Airdrop';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/store" element={<Store />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/demos" element={<Demos />} />
                <Route path="/livestream" element={<Livestream />} />
                <Route path="/presskit" element={<PressKit />} />
                <Route path="/creativeflow" element={<CreativeFlow />} />
                <Route path="/jestcoin" element={<JestCoin />} />
                <Route path="/airdrop" element={<Airdrop />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<Admin />} />

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
