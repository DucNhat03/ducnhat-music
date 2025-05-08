package com.ducnhat.musicapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "songs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Song {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String artist;
    
    private String album;
    
    private String imageUrl;
    
    private String fileUrl;
    
    private String genre;
    
    private Integer duration; // duration in seconds
    
    private Integer releaseYear;
} 