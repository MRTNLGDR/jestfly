
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-black">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-black to-black -z-10"></div>
      
      {/* Purple glow effect */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[120px] -z-10"></div>
      
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Unauthorized Access</h1>
        
        <p className="text-zinc-400 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link to="/">Back to Home</Link>
          </Button>
          
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
