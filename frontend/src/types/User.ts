export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 