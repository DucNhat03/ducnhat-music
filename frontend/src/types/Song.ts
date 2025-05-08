export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  fileUrl: string;
  genre?: string;
  duration?: number;
  releaseYear?: number;
} 