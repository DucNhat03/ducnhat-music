import { FaPlay, FaEdit, FaTrash, FaHeart, FaMusic, FaHeadphones } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Song } from '../types/Song';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onDelete: (id: number) => void;
}

const SongCard = ({ song, onPlay, onDelete }: SongCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // In a real app, you would call an API to save this preference
  };

  // Simulate play count - in a real app this would come from the backend
  const playCount = Math.floor(Math.random() * 1000);

  return (
    <div 
      className="music-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative h-48 w-full overflow-hidden group cursor-pointer" 
        onClick={() => onPlay(song)}
      >
        <img
          src={song.imageUrl || 'https://via.placeholder.com/300'}
          alt={song.title}
          className="music-card-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity`}
        ></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors transform hover:scale-110 shadow-lg">
            <FaPlay className="text-lg" />
          </div>
        </div>
        
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={toggleLike}
            className={`p-2 rounded-full bg-black/30 backdrop-blur-sm ${isLiked ? 'text-red-500' : 'text-white'} hover:bg-black/50 hover:scale-110 transition-all duration-300`}
            aria-label={isLiked ? "Unlike song" : "Like song"}
          >
            <FaHeart />
          </button>
        </div>
        
        {song.genre && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-purple-700/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
              <FaMusic className="mr-1 text-xs" /> {song.genre}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="song-title text-lg font-bold mb-1 truncate text-white">{song.title}</h3>
        <p className="song-artist text-gray-300 mb-2 truncate">{song.artist}</p>
        
        <div className="mt-3 flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center">
            <FaHeadphones className="mr-1 text-purple-400" />
            <span>{playCount.toLocaleString()} plays</span>
          </div>
          <span>{formatDuration(song.duration)}</span>
        </div>
        
        {song.releaseYear && (
          <div className="mt-2 text-sm text-gray-500">
            Released: {song.releaseYear}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between">
          <Link 
            to={`/edit-song/${song.id}`} 
            className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-md hover:bg-blue-900/20"
            aria-label="Edit song"
          >
            <FaEdit />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(song.id);
            }}
            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-900/20"
            aria-label="Delete song"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard; 