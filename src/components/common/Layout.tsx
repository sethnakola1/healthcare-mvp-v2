// src/components/common/Layout.tsx (Fixed - added proper default export)
import React from 'react';
// import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                HealthHorizon
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user?.roleDisplayName}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

function useAuth(): { user: any; } {
    throw new Error('Function not implemented.');
}
