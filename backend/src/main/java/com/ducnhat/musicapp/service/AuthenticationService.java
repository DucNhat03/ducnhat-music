package com.ducnhat.musicapp.service;

import com.ducnhat.musicapp.dto.AuthenticationRequest;
import com.ducnhat.musicapp.dto.AuthenticationResponse;
import com.ducnhat.musicapp.dto.ForgotPasswordRequest;
import com.ducnhat.musicapp.dto.RegisterRequest;
import com.ducnhat.musicapp.dto.ResetPasswordRequest;
import com.ducnhat.musicapp.model.Role;
import com.ducnhat.musicapp.model.User;
import com.ducnhat.musicapp.repository.UserRepository;
import com.ducnhat.musicapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthenticationResponse register(RegisterRequest request) {
        // Check if email or username already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        
        // Create new user
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Generate JWT token
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(mapUserToDto(user))
                .build();
    }
    
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        // Find user by email
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        
        // Generate JWT token
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(mapUserToDto(user))
                .build();
    }
    
    public void forgotPassword(ForgotPasswordRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (user != null) {
            // Generate reset token
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token expires in 1 hour
            userRepository.save(user);
            
            // In a real application, send an email with the reset link
            // For this demo, we'll just log it
            System.out.println("Reset token for " + user.getEmail() + ": " + token);
        }
        // Don't reveal if user exists or not for security reasons
    }
    
    public void resetPassword(ResetPasswordRequest request) {
        var user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));
        
        // Check if token has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
    
    private com.ducnhat.musicapp.dto.User mapUserToDto(User user) {
        return com.ducnhat.musicapp.dto.User.builder()
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