import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getSongById, updateSong } from '../services/api';
import type { Song } from '../types/Song';

const EditSong = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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

  useEffect(() => {
    const fetchSong = async () => {
      if (!id) return;
      
      try {
        const songId = parseInt(id, 10);
        const data = await getSongById(songId);
        
        setFormData({
          title: data.title,
          artist: data.artist,
          album: data.album || '',
          imageUrl: data.imageUrl || '',
          fileUrl: data.fileUrl,
          genre: data.genre || '',
          duration: data.duration ? String(data.duration) : '',
          releaseYear: data.releaseYear ? String(data.releaseYear) : ''
        });
        
        setFetchLoading(false);
      } catch (err) {
        console.error('Error fetching song:', err);
        setError('Failed to load song details. Please try again later.');
        setFetchLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Basic validation
    if (!formData.title.trim() || !formData.artist.trim() || !formData.fileUrl.trim()) {
      setError('Title, artist, and file URL are required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const songId = parseInt(id, 10);
      const songData: Partial<Song> = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album || undefined,
        imageUrl: formData.imageUrl || undefined,
        fileUrl: formData.fileUrl,
        genre: formData.genre || undefined,
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear, 10) : undefined
      };
      
      await updateSong(songId, songData);
      navigate(`/songs/${id}`);
    } catch (err) {
      console.error('Error updating song:', err);
      setError('Failed to update song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <Link to={`/songs/${id}`} className="flex items-center text-purple-400 mb-6 hover:text-purple-300 transition-colors">
        <FaArrowLeft className="mr-2" /> Back to Song Details
      </Link>
      
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Song</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/song.mp3"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Update Song
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSong; 