import axios, { AxiosError } from 'axios';
import type { Song } from '../types/Song';

const API_URL = 'http://localhost:8080/api';

// Simple cache implementation
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { response } = error;
    
    let errorMessage = 'An unexpected error occurred';
    
    if (response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (response.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    console.error('API Error:', errorMessage, error);
    
    return Promise.reject({ message: errorMessage, originalError: error });
  }
);

// Helper function for cached GET requests
const cachedGet = async <T>(url: string, bypassCache = false): Promise<T> => {
  const cacheKey = url;
  const now = Date.now();
  
  // Return cached data if valid and not bypassing cache
  if (!bypassCache && cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as T;
  }
  
  // Otherwise make the request
  const response = await api.get<T>(url);
  
  // Cache the result
  cache[cacheKey] = {
    data: response.data,
    timestamp: now
  };
  
  return response.data;
};

// Clear the entire cache or a specific key
export const clearCache = (specificKey?: string) => {
  if (specificKey) {
    delete cache[specificKey];
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
  }
};

// Song APIs with caching for GET requests
export const getSongs = async (bypassCache = false): Promise<Song[]> => {
  return cachedGet<Song[]>('/songs', bypassCache);
};

export const getSongById = async (id: number, bypassCache = false): Promise<Song> => {
  return cachedGet<Song>(`/songs/${id}`, bypassCache);
};

export const createSong = async (song: Omit<Song, 'id'>): Promise<Song> => {
  const response = await api.post<Song>('/songs', song);
  clearCache('/songs'); // Invalidate the song list cache
  return response.data;
};

export const updateSong = async (id: number, song: Partial<Song>): Promise<Song> => {
  const response = await api.put<Song>(`/songs/${id}`, song);
  clearCache(`/songs/${id}`); // Invalidate specific song cache
  clearCache('/songs'); // Invalidate the song list cache
  return response.data;
};

export const deleteSong = async (id: number): Promise<void> => {
  await api.delete(`/songs/${id}`);
  clearCache(`/songs/${id}`);
  clearCache('/songs');
};

export const searchSongsByTitle = async (query: string): Promise<Song[]> => {
  const cacheKey = `/songs/search/title?query=${query}`;
  return cachedGet<Song[]>(cacheKey);
};

export const searchSongsByArtist = async (query: string): Promise<Song[]> => {
  const cacheKey = `/songs/search/artist?query=${query}`;
  return cachedGet<Song[]>(cacheKey);
};

export const searchSongsByGenre = async (query: string): Promise<Song[]> => {
  const cacheKey = `/songs/search/genre?query=${query}`;
  return cachedGet<Song[]>(cacheKey);
};

// New functionality for playlists
export type Playlist = {
  id: number;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: string;
};

export const getPlaylists = async (): Promise<Playlist[]> => {
  return cachedGet<Playlist[]>('/playlists');
};

export const getPlaylistById = async (id: number): Promise<Playlist> => {
  return cachedGet<Playlist>(`/playlists/${id}`);
};

export const createPlaylist = async (playlist: Omit<Playlist, 'id' | 'createdAt'>): Promise<Playlist> => {
  const response = await api.post<Playlist>('/playlists', playlist);
  clearCache('/playlists');
  return response.data;
};

export const updatePlaylist = async (id: number, playlist: Partial<Playlist>): Promise<Playlist> => {
  const response = await api.put<Playlist>(`/playlists/${id}`, playlist);
  clearCache(`/playlists/${id}`);
  clearCache('/playlists');
  return response.data;
};

export const deletePlaylist = async (id: number): Promise<void> => {
  await api.delete(`/playlists/${id}`);
  clearCache(`/playlists/${id}`);
  clearCache('/playlists');
};

export const addSongToPlaylist = async (playlistId: number, songId: number): Promise<Playlist> => {
  const response = await api.post<Playlist>(`/playlists/${playlistId}/songs/${songId}`);
  clearCache(`/playlists/${playlistId}`);
  return response.data;
};

export const removeSongFromPlaylist = async (playlistId: number, songId: number): Promise<Playlist> => {
  const response = await api.delete<Playlist>(`/playlists/${playlistId}/songs/${songId}`);
  clearCache(`/playlists/${playlistId}`);
  return response.data;
}; 