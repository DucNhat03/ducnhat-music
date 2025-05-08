package com.ducnhat.musicapp;

import com.ducnhat.musicapp.model.Song;
import com.ducnhat.musicapp.repository.SongRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(SongRepository songRepository) {
        return args -> {
            // Check if data already exists
            if (songRepository.count() == 0) {
                // Sample songs
                songRepository.save(new Song(null, "Shape of You", "Ed Sheeran", "÷ (Divide)", 
                        "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96", 
                        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
                        "Pop", 235, 2017));
                
                songRepository.save(new Song(null, "Blinding Lights", "The Weeknd", "After Hours", 
                        "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36", 
                        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
                        "Synth-pop", 201, 2020));
                
                songRepository.save(new Song(null, "Bad Guy", "Billie Eilish", "When We All Fall Asleep, Where Do We Go?", 
                        "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e", 
                        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", 
                        "Electropop", 194, 2019));
                
                songRepository.save(new Song(null, "Uptown Funk", "Mark Ronson ft. Bruno Mars", "Uptown Special", 
                        "https://i.scdn.co/image/ab67616d0000b273e4c03df7fc46eeb9a76553f5", 
                        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 
                        "Funk", 270, 2015));
                
                songRepository.save(new Song(null, "Someone Like You", "Adele", "21", 
                        "https://i.scdn.co/image/ab67616d0000b273c7ab3ed9a4b4d02b95a9c9f1", 
                        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", 
                        "Soul", 285, 2011));
            }
        };
    }
} 