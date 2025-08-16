// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
// import { getCurrentUserAsync } from './store/authSlice';

// Components
// import LandingPage from './components/LandingPage';
// import LoginPage from './components/LoginPage';
// import Dashboard from './components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';
import { getCurrentUserAsync } from './store/slices/authSlice';
import LandingPage from './components/common/LandingPage';
import LoginPage from './components/auth/LoginPage';
import { JSX } from 'react/jsx-runtime';

const AppContent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app load
    if (token && !isAuthenticated) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <div className="error-page">
                <h1>Unauthorized</h1>
                <p>You don't have permission to access this page.</p>
              </div>
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="error-page">
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
