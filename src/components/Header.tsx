import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { adminUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {adminUser?.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{adminUser?.email}</p>
              <p className="text-gray-500">Role: {adminUser?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;