
import React from 'react';
import { useAuth } from '../contexts/auth';

const AdminPage = () => {
  const { userData } = useAuth();

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-zinc-800 rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Admin Information</h2>
          <p className="text-zinc-300">Welcome, {userData?.displayName || userData?.username}!</p>
          <p className="text-zinc-400 mt-1">You have administrator privileges.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-zinc-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">User Management</h3>
            <p className="text-zinc-400 text-sm">Manage users, permissions and roles</p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">Content Management</h3>
            <p className="text-zinc-400 text-sm">Manage content across the platform</p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">System Settings</h3>
            <p className="text-zinc-400 text-sm">Configure application settings</p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">Analytics</h3>
            <p className="text-zinc-400 text-sm">View system analytics and statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
