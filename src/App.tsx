import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/dashboard/Dashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<LoginPage />} /> {/* Default to login */}
            </Routes>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </Provider>
  );
};

export default App;