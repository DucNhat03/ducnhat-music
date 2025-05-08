import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getSongById, deleteSong } from '../services/api';
import type { Song } from '../types/Song';

interface SongDetailProps {
  onSelectSong: (song: Song) => void;
}

const SongDetail = ({ onSelectSong }: SongDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) return;
      
      try {
        const songId = parseInt(id, 10);
        const data = await getSongById(songId);
        setSong(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching song:', err);
        setError('Failed to load song details. Please try again later.');
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleDelete = async () => {
    if (!song) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete the song "${song.title}"?`);
    if (confirmed) {
      try {
        await deleteSong(song.id);
        navigate('/songs');
      } catch (err) {
        console.error('Error deleting song:', err);
        setError('Failed to delete song. Please try again.');
      }
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Song not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/songs" className="flex items-center text-purple-600 mb-6 hover:text-purple-800 transition-colors">
        <FaArrowLeft className="mr-2" /> Back to Songs
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={song.imageUrl || 'https://via.placeholder.com/400'}
              alt={song.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{song.title}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{song.artist}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600"><span className="font-semibold">Album:</span> {song.album || 'Single'}</p>
                <p className="text-gray-600"><span className="font-semibold">Genre:</span> {song.genre || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-semibold">Duration:</span> {formatDuration(song.duration)}</p>
                <p className="text-gray-600"><span className="font-semibold">Release Year:</span> {song.releaseYear || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => onSelectSong(song)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
              >
                <FaPlay className="mr-2" /> Play Song
              </button>
              
              <Link
                to={`/edit-song/${song.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <FaEdit className="mr-2" /> Edit
              </Link>
              
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetail; 