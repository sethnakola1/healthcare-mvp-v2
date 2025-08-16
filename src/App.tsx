// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { validateTokenAsync } from './store/slices/authSlice';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import BusinessUserRegistrationForm from './components/business/forms/BusinessUserRegistrationForm';
import './App.css';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(validateTokenAsync());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm />
              )
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === 'SUPER_ADMIN' ? (
                    <SuperAdminDashboard />
                  ) : (
                    <div>Dashboard for {user?.roleDisplayName}</div>
                  )}
                </ProtectedRoute>
              }
            />

            <Route
              path="business/users/register"
              element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                  <BusinessUserRegistrationForm />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;