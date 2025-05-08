import { Link } from 'react-router-dom';
import { FaMusic, FaSearch, FaBars, FaTimes, FaUser, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { searchSongsByTitle } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Song } from '../types/Song';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchSongsByTitle(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching songs:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-800 text-white shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white text-xl font-bold">
              <FaMusic className="mr-2 text-purple-400" />
              <span>DucNhat Music</span>
            </Link>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-gray-700 rounded"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-700 rounded-full overflow-hidden border border-gray-600 focus-within:ring-2 focus-within:ring-purple-500 transition">
                <input
                  type="text"
                  placeholder="Search songs..."
                  className="py-1.5 px-4 outline-none w-56 bg-gray-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-purple-600 text-white p-2 hover:bg-purple-700 transition-colors"
                  disabled={isSearching}
                >
                  <FaSearch />
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 shadow-xl rounded-md z-10 border border-gray-700">
                  <ul>
                    {searchResults.map((song) => (
                      <li key={song.id} className="border-b border-gray-700 last:border-0">
                        <Link 
                          to={`/songs/${song.id}`} 
                          className="block px-4 py-2 hover:bg-gray-700 text-white"
                          onClick={() => setSearchResults([])}
                        >
                          <div className="flex items-center">
                            <img
                              src={song.imageUrl || 'https://via.placeholder.com/40'}
                              alt={song.title}
                              className="h-8 w-8 rounded object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium">{song.title}</div>
                              <div className="text-xs text-gray-400">{song.artist}</div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
            
            <div className="flex space-x-6">
              <Link to="/" className="text-white hover:text-purple-400 transition-colors">Home</Link>
              <Link to="/songs" className="text-white hover:text-purple-400 transition-colors">Songs</Link>
              {isAuthenticated && (
                <Link to="/add-song" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-full text-sm transition-colors">
                  Add Song
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
              <button 
                onClick={toggleTheme}
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="relative flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white overflow-hidden">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser size={14} />
                      )}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center">
                        <FaUser className="mr-2 text-gray-400" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2 text-gray-400" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-white hover:text-purple-400 transition-colors">
                  <FaUser className="mr-2" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex items-center bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <input
                  type="text"
                  placeholder="Search songs..."
                  className="py-2 px-4 outline-none w-full bg-gray-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-purple-600 text-white p-3 hover:bg-purple-700 transition-colors"
                  disabled={isSearching}
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white py-2 hover:text-purple-400 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/songs" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white py-2 hover:text-purple-400 transition-colors"
              >
                Songs
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/add-song" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white py-2 hover:text-purple-400 transition-colors"
                  >
                    Add Song
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white py-2 hover:text-purple-400 transition-colors"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white py-2 hover:text-purple-400 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white py-2 hover:text-purple-400 transition-colors"
                >
                  Login
                </Link>
              )}
              <div className="flex items-center justify-between py-2 border-t border-gray-700 mt-2">
                <div className="text-white">
                  Theme
                </div>
                <button onClick={toggleTheme} className="p-2">
                  {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 