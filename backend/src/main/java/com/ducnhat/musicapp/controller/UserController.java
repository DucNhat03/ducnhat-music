package com.ducnhat.musicapp.controller;

import com.ducnhat.musicapp.dto.ChangePasswordRequest;
import com.ducnhat.musicapp.dto.User;
import com.ducnhat.musicapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    
    /**
     * Get current authenticated user profile
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }
    
    /**
     * Update user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User userDto) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), userDto));
    }
    
    /**
     * Change user password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok().build();
    }
} 