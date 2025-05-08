import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaRandom, FaRedo } from 'react-icons/fa';
import type { Song } from '../types/Song';

interface MusicPlayerProps {
  song: Song;
}

const MusicPlayer = ({ song }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(0));
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const source = useRef<MediaElementAudioSourceNode | null>(null);
  const rafId = useRef<number | null>(null);
  
  useEffect(() => {
    // Reset state and automatically start playing when a new song is loaded
    setIsPlaying(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
    
    // Set up audio visualizer
    if (!audioContext.current && audioRef.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      source.current = audioContext.current.createMediaElementSource(audioRef.current);
      source.current.connect(analyser.current);
      analyser.current.connect(audioContext.current.destination);
      
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
      
      // Start visualizer animation
      startVisualizer();
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [song.id]);
  
  const startVisualizer = () => {
    if (!analyser.current || !dataArray.current) return;
    
    const updateVisualizer = () => {
      analyser.current!.getByteFrequencyData(dataArray.current!);
      
      // Sample values for the visualizer bars
      const sampleSize = Math.floor(dataArray.current!.length / 20);
      const newValues = Array(20).fill(0).map((_, i) => {
        const start = i * sampleSize;
        const end = start + sampleSize;
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += dataArray.current![j];
        }
        return sum / sampleSize / 255;  // Normalize to 0-1
      });
      
      setVisualizerValues(newValues);
      rafId.current = requestAnimationFrame(updateVisualizer);
    };
    
    updateVisualizer();
  };
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    // Logic for shuffle would be implemented at the playlist level
  };
  
  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeatOn;
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-700 shadow-lg z-50">
      {/* Visualizer bars */}
      <div className="flex h-1 w-full">
        {visualizerValues.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-purple-500"
            style={{ height: '4px', transform: `scaleY(${value * 6 + 0.1})`, transformOrigin: 'bottom' }}
          />
        ))}
      </div>
      
      {/* Player controls */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center">
        <div className="flex items-center mb-3 md:mb-0 md:w-1/3">
          <div className="relative h-14 w-14 overflow-hidden rounded-md shadow-md mr-3">
            <img
              src={song.imageUrl || 'https://via.placeholder.com/60'}
              alt={song.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          <div>
            <h4 className="font-semibold text-white truncate">{song.title}</h4>
            <p className="text-gray-400 text-xs truncate">{song.artist}</p>
          </div>
        </div>
        
        <div className="md:w-1/3 mb-3 md:mb-0">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <button 
              className={`text-gray-400 hover:text-white transition-colors p-1 ${isShuffleOn ? 'text-purple-500' : ''}`}
              onClick={toggleShuffle}
            >
              <FaRandom />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-1">
              <FaStepBackward />
            </button>
            <button
              className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-1">
              <FaStepForward />
            </button>
            <button 
              className={`text-gray-400 hover:text-white transition-colors p-1 ${isRepeatOn ? 'text-purple-500' : ''}`}
              onClick={toggleRepeat}
            >
              <FaRedo />
            </button>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs w-10 text-right text-gray-400">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="mx-3 flex-grow player-progress"
            />
            <span className="text-xs w-10 text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center md:w-1/3 md:justify-end">
          <button
            className="p-2 text-gray-400 hover:text-white transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="ml-2 w-20 volume-slider"
          />
        </div>
        
        <audio
          ref={audioRef}
          src={song.fileUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => !isRepeatOn && setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;