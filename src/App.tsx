
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import './App.css';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import JestCoinPage from './pages/JestCoinPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';
import LogsPage from './pages/LogsPage';
import BookingsPage from './pages/BookingsPage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import PressKitPage from './pages/PressKitPage';
import AssetUploader from './pages/AssetUploader';
import AirdropPage from './pages/AirdropPage';
import LiveStreamPage from './pages/LiveStreamPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFound from './pages/NotFound';
import GlassHeader from './components/GlassHeader';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
        <GlassHeader />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:productId" element={<ProductDetailPage />} />
            <Route path="/jestcoin" element={<JestCoinPage />} />
            <Route path="/community/*" element={<CommunityPage />} />
            <Route path="/bookings/*" element={<BookingsPage />} />
            <Route path="/demo-submission" element={<DemoSubmissionPage />} />
            <Route path="/press-kit" element={<PressKitPage />} />
            <Route path="/airdrop" element={<AirdropPage />} />
            <Route path="/live" element={<LiveStreamPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de Admin */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredProfileType="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/logs" 
              element={
                <ProtectedRoute requiredProfileType="admin">
                  <LogsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assets" 
              element={
                <ProtectedRoute requiredProfileType="admin">
                  <AssetUploader />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de fallback para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
