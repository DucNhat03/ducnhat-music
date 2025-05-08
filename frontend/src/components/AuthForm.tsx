import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaMusic } from 'react-icons/fa';
import type { AuthFormData } from '../types/Auth';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  onSubmit: (formData: AuthFormData, mode: AuthMode) => void;
  loading: boolean;
}

const AuthForm = ({ onSubmit, loading }: AuthFormProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, mode);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <FaMusic className="text-purple-500 text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 mt-2">
          {mode === 'login' 
            ? 'Sign in to your account to continue' 
            : 'Join DucNhat Music to start streaming'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>
        )}
        
        {mode === 'register' && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="johndoe"
                required
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="********"
              required
            />
          </div>
        </div>
        
        {mode === 'login' && (
          <div className="flex justify-end">
            <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Forgot password?
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            mode === 'login' ? 'Sign In' : 'Create Account'
          )}
        </button>
        
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm; 