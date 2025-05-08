package com.ducnhat.musicapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String role;
    private String createdAt;
} 