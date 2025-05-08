import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { AuthFormData } from '../types/Auth';

const API_URL = 'http://localhost:8080/api/auth';

// Token storage keys
const ACCESS_TOKEN_KEY = 'ducnhat_music_access_token';
const USER_KEY = 'ducnhat_music_user';

// Interface for the JWT token payload
interface JwtPayload {
  sub: string; // subject (usually the user email)
  exp: number; // expiration time
  iat: number; // issued at time
}

// Interface for API responses
interface AuthResponse {
  token: string;
  user: User;
}

// User interface matching the DTO from backend
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
}

// Create axios instance for auth requests
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests if token exists
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login with email and password
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await authApi.post<AuthResponse>('/login', { email, password });
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const register = async (data: AuthFormData): Promise<User> => {
  try {
    const response = await authApi.post<AuthResponse>('/register', data);
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token expired, clean up
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    logout();
    return false;
  }
};

// Check if user has admin role
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await authApi.post('/forgot-password', { email });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    await authApi.post('/reset-password', { token, password });
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  try {
    const response = await authApi.put<User>('/profile', data);
    
    // Update stored user data
    const updatedUser = response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  requestPasswordReset,
  resetPassword,
  updateProfile
}; 