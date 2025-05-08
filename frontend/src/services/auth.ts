import axios, { AxiosError } from 'axios';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  AuthResponse 
} from '../types/User';

const API_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle token storage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Check if token exists and set axios headers
export const initAuth = () => {
  const token = getToken();
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

// Authentication API
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', credentials);
    const { token, user } = response.data;
    
    setAuthToken(token);
    setUser(user);
    
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw new Error('Login failed. Please try again later.');
  }
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', data);
    const { token, user } = response.data;
    
    setAuthToken(token);
    setUser(user);
    
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 409) {
      throw new Error('Email or username already exists');
    }
    throw new Error('Registration failed. Please try again later.');
  }
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  try {
    await api.post('/forgot-password', data);
  } catch (error) {
    throw new Error('Failed to process your request. Please try again later.');
  }
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    await api.post('/reset-password', data);
  } catch (error) {
    throw new Error('Failed to reset password. Please try again later.');
  }
};

export const logout = (): void => {
  removeAuthToken();
  removeUser();
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/me');
    setUser(response.data);
    return response.data;
  } catch (error) {
    logout();
    throw new Error('Session expired. Please login again.');
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>('/me', userData);
    setUser(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update profile. Please try again.');
  }
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.post('/change-password', { oldPassword, newPassword });
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      throw new Error('Current password is incorrect');
    }
    throw new Error('Failed to change password. Please try again.');
  }
}; 