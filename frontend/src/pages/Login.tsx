import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import type { AuthFormData } from '../types/Auth';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'register';

// Type guard for error objects
const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (formData: AuthFormData, mode: AuthMode) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      
      // Redirect to home page after successful authentication
      navigate('/');
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setError(
        isErrorWithMessage(err) ? err.message : 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <AuthForm 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 