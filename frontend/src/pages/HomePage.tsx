import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaPlus, FaPlay, FaEdit, FaTrash, FaChartLine, FaHistory, FaHeart, FaSearch, FaFilter } from 'react-icons/fa';
import { getSongs } from '../services/api';
import SongCard from '../components/SongCard';
import type { Song } from '../types/Song';

interface HomePageProps {
  onSelectSong: (song: Song) => void;
}

const HomePage = ({ onSelectSong }: HomePageProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyPlayed] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGenreFilter, setActiveGenreFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs();
        setSongs(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Please try again later.');
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (id: number) => {
    // In a real app, you would call the delete API here
    setSongs(songs.filter(song => song.id !== id));
  };

  // Filter songs based on search term and genre filter
  const filteredSongs = songs.filter(song => {
    const matchesSearch = searchTerm === '' || 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (song.genre && song.genre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = activeGenreFilter === null || 
      (song.genre && song.genre.toLowerCase() === activeGenreFilter.toLowerCase());
    
    return matchesSearch && matchesGenre;
  });

  // Get unique genres from songs
  const genres = Array.from(new Set(songs.filter(song => song.genre).map(song => song.genre as string)));

  // Generate trending songs (in a real app, this would come from the backend)
  const trendingSongs = [...filteredSongs].sort(() => 0.5 - Math.random()).slice(0, 4);

  // Handler for clearing filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveGenreFilter(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero section with search */}
      <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-800 mb-10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center">
            <FaMusic className="mr-3 text-purple-400" /> Welcome to DucNhat Music
          </h1>
          <p className="text-lg text-gray-200 mb-6 max-w-3xl">
            Discover your favorite music, create playlists, and enjoy high-quality sound with our feature-rich music player. Start exploring now!
          </p>

          {/* Search and filter section */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Link 
              to="/add-song" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-purple-700 transition-colors inline-flex shadow-lg"
            >
              <FaPlus className="mr-2" /> Add New Song
            </Link>
          </div>

          {/* Genre filters */}
          {genres.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="mr-2 flex items-center">
                <FaFilter className="text-purple-400 mr-2" />
                <span className="text-gray-300 text-sm">Genres:</span>
              </div>
              <button
                onClick={() => setActiveGenreFilter(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeGenreFilter === null 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenreFilter(genre)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeGenreFilter === genre
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {genre}
                </button>
              ))}
              {(searchTerm || activeGenreFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-red-300 hover:text-red-200 transition-colors ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results summary when filtering */}
      {(searchTerm || activeGenreFilter) && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h2 className="text-lg text-white mb-1">
            Search Results: <span className="font-semibold">{filteredSongs.length} songs found</span>
          </h2>
          <p className="text-sm text-gray-400">
            {searchTerm && `Searching for "${searchTerm}"`} 
            {searchTerm && activeGenreFilter && ' in '} 
            {activeGenreFilter && `genre "${activeGenreFilter}"`}
          </p>
        </div>
      )}

      {/* Trending section */}
      <section className="mb-10 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaChartLine className="mr-2 text-purple-500" /> Trending Now
          </h2>
          <Link to="/songs" className="text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </Link>
        </div>
        
        {filteredSongs.length === 0 ? (
          <div className="bg-gray-800 text-gray-300 px-4 py-6 rounded-lg text-center">
            <p>No trending songs available with the current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingSongs.map(song => (
              <SongCard 
                key={`trending-${song.id}`} 
                song={song} 
                onPlay={onSelectSong} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Songs section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaHeart className="mr-2 text-red-500" /> Featured Songs
          </h2>
        </div>
        
        {filteredSongs.length === 0 ? (
          <div className="bg-gray-800 text-gray-300 px-4 py-6 rounded-lg text-center">
            <p>No songs found with the current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSongs.slice(0, 4).map(song => (
              <SongCard 
                key={song.id} 
                song={song} 
                onPlay={onSelectSong} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played section - would be populated in a real app */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaHistory className="mr-2 text-blue-400" /> Recently Played
          </h2>
        </div>
        
        {recentlyPlayed.length === 0 ? (
          <div className="bg-gray-800 text-gray-300 px-4 py-6 rounded-lg text-center">
            <p>No recently played songs. Start listening to build your history!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyPlayed.map(song => (
              <SongCard 
                key={`recent-${song.id}`} 
                song={song} 
                onPlay={onSelectSong} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </section>

      {/* All Songs Table */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">All Songs</h2>
          <Link to="/songs" className="text-purple-400 hover:text-purple-300 transition-colors">
            View All
          </Link>
        </div>
        
        {filteredSongs.length === 0 ? (
          <div className="bg-gray-800 text-gray-300 px-4 py-6 rounded-lg text-center">
            <p>No songs found with the current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Album</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSongs.slice(0, 5).map(song => (
                  <tr key={song.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={song.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={song.title} 
                          className="h-10 w-10 rounded-md mr-3 object-cover"
                        />
                        <div className="text-sm font-medium text-white">{song.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.artist}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.album || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {song.genre ? (
                        <span className="px-2 py-1 bg-purple-900/50 rounded-full text-xs">
                          {song.genre}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => onSelectSong(song)}
                        className="text-purple-400 hover:text-purple-300 mr-3 p-1 rounded-full hover:bg-purple-900/30 transition-colors"
                        title="Play"
                      >
                        <FaPlay />
                      </button>
                      <Link 
                        to={`/edit-song/${song.id}`} 
                        className="text-blue-400 hover:text-blue-300 mr-3 p-1 rounded-full hover:bg-blue-900/30 transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(song.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage; 