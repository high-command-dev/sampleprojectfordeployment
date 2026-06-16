import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getToken, removeToken, setToken as saveToken } from '../utils/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setAuthToken] = useState(() => getToken());

  const login = useCallback((nextToken, nextUser = null) => {
    saveToken(nextToken);
    setAuthToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, token, login, logout, setUser }), [user, token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
