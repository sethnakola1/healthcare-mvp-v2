// src/components/debug/DebugPanel.tsx (FIX MISSING EXPORT)
import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { DebugUtils } from '../../utils/debug';

export const DebugPanel: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.REACT_APP_ENVIRONMENT !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg z-50"
        title="Debug Panel"
      >
        🐛
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-white border rounded-lg shadow-xl p-4 max-w-md z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Debug Panel</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <strong>Auth State:</strong>
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

            <div className="space-y-2">
              <button
                onClick={DebugUtils.testBackendConnection}
                className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs"
              >
                Test Backend Connection
              </button>
              
              <button
                onClick={DebugUtils.createTestUser}
                className="w-full bg-green-500 text-white px-3 py-1 rounded text-xs"
              >
                Create Test Super Admin
              </button>

              <button
                onClick={() => DebugUtils.logAuthState(authState)}
                className="w-full bg-purple-500 text-white px-3 py-1 rounded text-xs"
              >
                Log Auth State
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <strong>API URL:</strong> {process.env.REACT_APP_API_URL}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel;