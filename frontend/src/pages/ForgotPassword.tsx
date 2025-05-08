import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMusic, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      await forgotPassword({ email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter the email address associated with your account and we'll send you a link to reset your password.
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
              If an account exists with that email, we've sent password reset instructions.
              <br />
              <strong>Note:</strong> In this demo version, the token is logged to the server console.
            </span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaEnvelope className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                </span>
              )}
              {isLoading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword; 