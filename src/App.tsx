import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUser } from './store/slices/authSlice';

import './App.css';
import { LoadingSpinner } from './components/common';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

// Root Component with Provider
const Root: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default Root;

//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// };
//
// // Public Route Component (redirect to dashboard if already authenticated)
// const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
//
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
//
//   return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
// };
//
// function AppContent() {
//   const dispatch = useAppDispatch();
//   const { isLoading } = useAppSelector((state) => state.auth);
//
//   useEffect(() => {
//     // Check authentication status on app start
//     dispatch(getCurrentUser());
//   }, [dispatch]);
//
//   if (isLoading) {
//     return <LoadingSpinner message="Checking authentication..." />;
//   }
//
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <LoginPage />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </div>
//   );
// }
//
// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <AppContent />
//       </Router>
//     </Provider>
//   );
// }
//
// export default App;