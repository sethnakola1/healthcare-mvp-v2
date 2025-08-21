const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = SecurityUtils.getItem('authToken');
      if (token) {
        try {
          const user = await apiService.getCurrentUser(token);
          setState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          SecurityUtils.removeItem('authToken');
          SecurityUtils.removeItem('authUser');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const loginResponse = await apiService.login(email, password);
      const user = await apiService.getCurrentUser(loginResponse.accessToken);
      
      SecurityUtils.setItem('authToken', loginResponse.accessToken);
      SecurityUtils.setItem('authUser', JSON.stringify(user));

      setState({
        user,
        token: loginResponse.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (state.token) {
      try {
        await apiService.logout(state.token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    SecurityUtils.clear();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const getCurrentUser = async (): Promise<void> => {
    if (state.token) {
      try {
        const user = await apiService.getCurrentUser(state.token);
        setState(prev => ({ ...prev, user }));
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};