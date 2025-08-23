import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/authSlice';
import { useAuth } from '../../contexts/AuthContext';

const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const authState = useAppSelector(selectAuth);
  const { user, isAuthenticated, isLoading, error } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700"
      >
        Debug Info
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Debug Information</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Auth State Section */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Auth State (Redux):</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify({
                  isAuthenticated: authState.isAuthenticated,
                  isLoading: authState.isLoading,
                  user: authState.user ? {
                    name: authState.user.firstName + ' ' + authState.user.lastName,
                    role: authState.user.role,
                    email: authState.user.email
                  } : null,
                  error: authState.error
                }, null, 2)}
              </pre>
            </div>

            {/* Context State Section */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Auth Context:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify({
                  isAuthenticated,
                  isLoading,
                  user: user ? {
                    name: user.firstName + ' ' + user.lastName,
                    role: user.role,
                    email: user.email
                  } : null,
                  error
                }, null, 2)}
              </pre>
            </div>

            {/* Local Storage Section */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Local Storage:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify({
                  accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
                  refreshToken: localStorage.getItem('refreshToken') ? 'Present' : 'Missing',
                  user: localStorage.getItem('user') ? 'Present' : 'Missing',
                }, null, 2)}
              </pre>
            </div>

            {/* Environment Info */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Environment:</h4>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify({
                  NODE_ENV: process.env.NODE_ENV,
                  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600"
              >
                Clear All Data & Reload
              </button>
              <button
                onClick={() => console.log('Auth State:', { authState, context: { user, isAuthenticated, isLoading, error } })}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;