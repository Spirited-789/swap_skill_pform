import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.email === email);
    if (user && !user.isBanned) {
      const authenticatedUser = { ...user };
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      setAuthState({
        user: authenticatedUser,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // Mock registration - in real app, this would be an API call
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      location: userData.location || '',
      profileImage: userData.profileImage,
      skillsOffered: [],
      skillsWanted: [],
      availability: 'Available',
      isPublic: true,
      role: 'user',
      joinedAt: new Date().toISOString(),
      rating: 0,
      totalSwaps: 0,
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      loading: false,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};