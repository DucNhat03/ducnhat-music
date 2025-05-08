import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { createSong } from '../services/api';
import type { Song } from '../types/Song';

const AddSong = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    imageUrl: '',
    fileUrl: '',
    genre: '',
    duration: '',
    releaseYear: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.artist.trim() || !formData.fileUrl.trim()) {
      setError('Title, artist, and file URL are required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const songData: Omit<Song, 'id'> = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album || undefined,
        imageUrl: formData.imageUrl || undefined,
        fileUrl: formData.fileUrl,
        genre: formData.genre || undefined,
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear, 10) : undefined
      };
      
      await createSong(songData);
      navigate('/songs');
    } catch (err) {
      console.error('Error creating song:', err);
      setError('Failed to create song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/songs" className="flex items-center text-purple-400 mb-6 hover:text-purple-300 transition-colors">
        <FaArrowLeft className="mr-2" /> Back to Songs
      </Link>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Add New Song</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
                Artist *
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="album" className="block text-sm font-medium text-gray-300 mb-1">
                Album
              </label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                min="1"
              />
            </div>
            
            <div>
              <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-300 mb-1">
                Release Year
              </label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-300 mb-1">
                File URL *
              </label>
              <input
                type="url"
                id="fileUrl"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="https://example.com/song.mp3"
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Song
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSong; 