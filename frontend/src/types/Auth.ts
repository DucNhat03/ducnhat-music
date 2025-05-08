export interface AuthFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
} 