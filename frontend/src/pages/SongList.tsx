import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getSongs, deleteSong, searchSongsByTitle } from '../services/api';
import SongCard from '../components/SongCard';
import type { Song } from '../types/Song';

interface SongListProps {
  onSelectSong: (song: Song) => void;
}

const SongList = ({ onSelectSong }: SongListProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getSongs();
        setSongs(data);
        setFilteredSongs(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredSongs(songs);
      return;
    }
    
    try {
      const results = await searchSongsByTitle(searchQuery);
      setFilteredSongs(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }
    
    try {
      await deleteSong(id);
      setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
      setFilteredSongs(prevSongs => prevSongs.filter(song => song.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete song. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Loading songs...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">All Songs</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search songs..."
              className="border border-gray-600 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
            >
              <FaSearch />
            </button>
          </form>
          
          <Link 
            to="/add-song" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Song
          </Link>
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 text-yellow-300 px-4 py-3 rounded">
          <p>No songs found. Try a different search or add some songs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSongs.map(song => (
            <SongCard 
              key={song.id} 
              song={song} 
              onPlay={onSelectSong} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SongList; 