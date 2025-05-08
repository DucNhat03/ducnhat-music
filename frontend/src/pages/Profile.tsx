import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: ''
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    
    try {
      await updateProfile({
        username: profileData.username,
        firstName: profileData.firstName || undefined,
        lastName: profileData.lastName || undefined,
        profilePicture: profileData.profilePicture || undefined
      });
      setProfileSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setProfileError(err.message);
      } else {
        setProfileError('An unexpected error occurred');
      }
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError('An unexpected error occurred');
      }
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-white">Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-900 p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-24 h-24 mb-4">
                <img 
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=9333EA&color=fff`} 
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover bg-gray-700"
                />
                <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                  <FaCamera className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white">{user.username}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'password' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
                
                {profileError && (
                  <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{profileError}</span>
                  </div>
                )}
                
                {profileSuccess && (
                  <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">Profile updated successfully!</span>
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          value={profileData.username}
                          onChange={handleProfileChange}
                          className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email (Read Only)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-gray-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        id="profilePicture"
                        name="profilePicture"
                        type="url"
                        value={profileData.profilePicture}
                        onChange={handleProfileChange}
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                
                {passwordError && (
                  <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{passwordError}</span>
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">Password changed successfully!</span>
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          required
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
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
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="appearance-none rounded-md block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 