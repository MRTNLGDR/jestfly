
import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="app">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
