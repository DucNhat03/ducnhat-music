import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../types/User';
import * as authService from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.initAuth()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize authentication', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };
  
  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };
  
  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    changePassword,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 