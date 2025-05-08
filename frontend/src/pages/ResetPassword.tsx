import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaMusic, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extract token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Reset token is missing. Please use the link provided in the email.');
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate form
    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!token) {
      setError('Reset token is missing. Please use the link provided in the email.');
      return;
    }

    try {
      await resetPassword({ token, password });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <div className="flex justify-center">
            <FaMusic className="text-5xl text-purple-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded relative">
            <span className="block sm:inline">
              Your password has been reset successfully! Redirecting to login...
            </span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="New password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-md block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !token}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                (isLoading || !token) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                </span>
              )}
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="flex items-center justify-center text-sm text-purple-400 hover:text-purple-300"
          >
            <FaArrowLeft className="mr-2" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 