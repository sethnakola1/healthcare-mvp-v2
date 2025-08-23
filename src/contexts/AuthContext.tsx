// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/slices/authSlice'; // Fixed path
import { RootState } from '../store/store'; // Assume root state type

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, error: null };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<any>(); // Use any for now, or define AppDispatch
  const reduxAuthState = useSelector((state: RootState) => state.auth);

  const [state, dispatchReducer] = useReducer(authReducer, initialState);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatchReducer({ type: 'LOGIN_SUCCESS', payload: JSON.parse(storedUser) });
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      setLocalError((err as Error).message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    dispatchReducer({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    user: reduxAuthState.user,
    isAuthenticated: reduxAuthState.isAuthenticated,
    isLoading: reduxAuthState.isLoading || localLoading,
    error: reduxAuthState.error || localError,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;