
import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="app relative min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 bg-black">
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:44px_44px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 bg-gradient-to-br from-purple-800 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 bg-gradient-to-tr from-indigo-800 to-transparent blur-3xl"></div>
        
        {/* Light Beams */}
        <div className="absolute top-1/4 right-1/3 w-[200px] h-[600px] rotate-45 opacity-5 bg-gradient-to-b from-white via-white to-transparent blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[600px] -rotate-45 opacity-5 bg-gradient-to-t from-indigo-500 via-indigo-500 to-transparent blur-xl"></div>
      </div>

      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
