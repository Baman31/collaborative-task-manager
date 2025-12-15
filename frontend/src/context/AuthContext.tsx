import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';
import { connectSocket, disconnectSocket, socket } from '../services/socket';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data.success && response.data.data) {
          setUser(response.data.data.user);
          connectSocket();
          socket.emit('join', response.data.data.user.id);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    if (response.data.success && response.data.data) {
      setUser(response.data.data.user);
      connectSocket();
      socket.emit('join', response.data.data.user.id);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await authAPI.register({ email, password, name });
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
