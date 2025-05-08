package com.ducnhat.musicapp.service;

import com.ducnhat.musicapp.dto.ChangePasswordRequest;
import com.ducnhat.musicapp.dto.User;
import com.ducnhat.musicapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Get current user profile
     */
    public User getCurrentUser(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        return mapUserToDto(user);
    }
    
    /**
     * Update user profile
     */
    @Transactional
    public User updateProfile(String email, User userDto) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        // Only update allowed fields
        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        
        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        
        if (userDto.getProfilePicture() != null) {
            user.setProfilePicture(userDto.getProfilePicture());
        }
        
        // Username can be updated if it's not already taken
        if (userDto.getUsername() != null && !userDto.getUsername().equals(user.getUsername())) {
            userRepository.findByUsername(userDto.getUsername())
                    .ifPresent(u -> {
                        throw new IllegalArgumentException("Username already taken");
                    });
            
            user.setUsername(userDto.getUsername());
        }
        
        // Save the updated user
        var savedUser = userRepository.save(user);
        
        // Return the updated user as DTO
        return mapUserToDto(savedUser);
    }
    
    /**
     * Change user password
     */
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        
        // Validate current password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    /**
     * Map entity to DTO
     */
    private User mapUserToDto(com.ducnhat.musicapp.model.User user) {
        return User.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
} 