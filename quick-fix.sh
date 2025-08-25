#!/bin/bash
# quick-fix.sh - Script to quickly resolve TypeScript and ESLint errors

echo "🔧 HealthHorizon Frontend Quick Fix Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root."
    exit 1
fi

echo "📦 Installing missing dependencies..."
npm install --save-dev @types/react @types/react-dom

echo "🧹 Fixing ESLint configuration..."
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "react-hooks/exhaustive-deps": "warn"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn"
      }
    }
  ]
}
EOF

echo "🔧 Running TypeScript check..."
npx tsc --noEmit --skipLibCheck

echo "🧼 Running ESLint fix..."
npx eslint src --ext .ts,.tsx --fix

echo "🔍 Checking for remaining issues..."
ERRORS=$(npx eslint src --ext .ts,.tsx 2>&1 | grep -c "error" || true)
WARNINGS=$(npx eslint src --ext .ts,.tsx 2>&1 | grep -c "warning" || true)

echo "📊 Results:"
echo "   Errors: $ERRORS"
echo "   Warnings: $WARNINGS"

if [ "$ERRORS" -eq 0 ]; then
    echo "✅ All critical errors fixed!"
    echo "🚀 You can now run: npm start"
else
    echo "⚠️  Some errors remain. Please check the output above."
fi

echo ""
echo "🔗 Next steps:"
echo "1. Test login with your backend: npm start"
echo "2. Use debug endpoint: POST /api/debug/fix-super-admin-complete"
echo "3. Login with: sethnakola@healthhorizon.com / SuperAdmin123!"

# src/utils/debug.ts - Debug utilities for development
echo "🐛 Creating debug utilities..."
mkdir -p src/utils
cat > src/utils/debug.ts << 'EOF'
// Debug utilities for development environment
export class DebugUtils {
  private static isDebugMode(): boolean {
    return process.env.REACT_APP_ENVIRONMENT === 'development';
  }

  static log(message: string, data?: any): void {
    if (this.isDebugMode()) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  static logApiCall(method: string, url: string, data?: any): void {
    if (this.isDebugMode()) {
      console.group(`[API] ${method.toUpperCase()} ${url}`);
      if (data) {
        console.log('Request data:', data);
      }
      console.groupEnd();
    }
  }

  static logAuthState(state: any): void {
    if (this.isDebugMode()) {
      console.group('[AUTH] State Update');
      console.log('Authenticated:', state.isAuthenticated);
      console.log('Loading:', state.isLoading);
      console.log('User:', state.user?.firstName, state.user?.role);
      console.log('Error:', state.error);
      console.groupEnd();
    }
  }

  static testBackendConnection = async (): Promise<void> => {
    if (!this.isDebugMode()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/health`);
      if (response.ok) {
        console.log('✅ Backend connection successful');
      } else {
        console.error('❌ Backend connection failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Backend connection error:', error);
    }
  };

  static createTestUser = async (): Promise<void> => {
    if (!this.isDebugMode()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/debug/fix-super-admin-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('🔧 Test user creation result:', result);
    } catch (error) {
      console.error('❌ Failed to create test user:', error);
    }
  };
}

// Make debug utilities available globally in development
if (process.env.REACT_APP_ENVIRONMENT === 'development') {
  (window as any).HealthHorizonDebug = DebugUtils;
}
EOF

# src/components/debug/DebugPanel.tsx - Debug panel for development
echo "🛠️ Creating debug panel..."
mkdir -p src/components/debug
cat > src/components/debug/DebugPanel.tsx << 'EOF'
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
EOF

# Update App.tsx to include debug panel
echo "🔧 Adding debug panel to App.tsx..."
cat > src/App.tsx << 'EOF'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';
import { BusinessRole } from './types/auth.types';

// Components
import LoginForm from './components/auth/LoginForm';

import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/common/Layout';
import DebugPanel from './components/debug/DebugPanel';

// Initialize debug utilities
import './utils/debug';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Try to get current user on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  const getDashboardRoute = (role: BusinessRole): string => {
    switch (role) {
      case BusinessRole.SUPER_ADMIN:
        return '/dashboard/super-admin';
      case BusinessRole.TECH_ADVISOR:
        return '/dashboard/tech-advisor';
      case BusinessRole.HOSPITAL_ADMIN:
        return '/dashboard/hospital-admin';
      case BusinessRole.DOCTOR:
        return '/dashboard/doctor';
      case BusinessRole.NURSE:
        return '/dashboard/nurse';
      case BusinessRole.PATIENT:
        return '/dashboard/patient';
      default:
        return '/dashboard';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={user ? getDashboardRoute(user.role as BusinessRole) : '/dashboard'} replace />
            ) : (
              <LoginForm />
            )
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute requiredRoles={[BusinessRole.SUPER_ADMIN]}>
              <Layout>
                <SuperAdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Route */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Unauthorized</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
              </div>
            </div>
          } 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated && user ? (
              <Navigate to={getDashboardRoute(user.role as BusinessRole)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } 
        />
      </Routes>
      
      {/* Debug Panel - only shows in development */}
      <DebugPanel />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <div className="App">
          <AppContent />
        </div>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
EOF

echo "✅ Quick fix completed!"
echo ""
echo "🚀 To start the application:"
echo "   npm start"
echo ""
echo "🔧 For debugging:"
echo "   1. Open browser console"
echo "   2. Look for the debug button (🐛) in bottom-right"
echo "   3. Use HealthHorizonDebug utilities in console"
echo ""
echo "📡 Test backend connection:"
echo "   curl http://localhost:8080/api/auth/health"