package com.ducnhat.musicapp.service;

import com.ducnhat.musicapp.model.Song;
import com.ducnhat.musicapp.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {
    
    private final SongRepository songRepository;
    
    @Autowired
    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }
    
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }
    
    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }
    
    public Song saveSong(Song song) {
        return songRepository.save(song);
    }
    
    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
    
    public List<Song> searchByTitle(String title) {
        return songRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Song> searchByArtist(String artist) {
        return songRepository.findByArtistContainingIgnoreCase(artist);
    }
    
    public List<Song> searchByGenre(String genre) {
        return songRepository.findByGenreContainingIgnoreCase(genre);
    }
} 