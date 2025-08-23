import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Corrected path
import { LoginPage } from './components/auth/LoginPage'; // Corrected path
import { Dashboard } from './components/dashboard/Dashboard'; // Corrected path
import { Provider } from 'react-redux';
import { store } from './store/store'; // Assuming you have a Redux store

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add other routes here */}
            <Route path="/" element={<LoginPage />} /> {/* Default route */}
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
};