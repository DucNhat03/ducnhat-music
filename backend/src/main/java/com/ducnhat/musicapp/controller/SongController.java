package com.ducnhat.musicapp.controller;

import com.ducnhat.musicapp.model.Song;
import com.ducnhat.musicapp.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/songs")
public class SongController {
    
    private final SongService songService;
    
    @Autowired
    public SongController(SongService songService) {
        this.songService = songService;
    }
    
    @GetMapping
    public ResponseEntity<List<Song>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        Optional<Song> song = songService.getSongById(id);
        return song.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Song> createSong(@RequestBody Song song) {
        return new ResponseEntity<>(songService.saveSong(song), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @RequestBody Song song) {
        Optional<Song> existingSong = songService.getSongById(id);
        if (existingSong.isPresent()) {
            song.setId(id);
            return ResponseEntity.ok(songService.saveSong(song));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        Optional<Song> existingSong = songService.getSongById(id);
        if (existingSong.isPresent()) {
            songService.deleteSong(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search/title")
    public ResponseEntity<List<Song>> searchByTitle(@RequestParam String query) {
        return ResponseEntity.ok(songService.searchByTitle(query));
    }
    
    @GetMapping("/search/artist")
    public ResponseEntity<List<Song>> searchByArtist(@RequestParam String query) {
        return ResponseEntity.ok(songService.searchByArtist(query));
    }
    
    @GetMapping("/search/genre")
    public ResponseEntity<List<Song>> searchByGenre(@RequestParam String query) {
        return ResponseEntity.ok(songService.searchByGenre(query));
    }
} 