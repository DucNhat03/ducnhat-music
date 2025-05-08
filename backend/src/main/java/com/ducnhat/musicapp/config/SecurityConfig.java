package com.ducnhat.musicapp.config;

import com.ducnhat.musicapp.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configure security settings
        http
            // Disable CSRF protection for stateless API
            .csrf(AbstractHttpConfigurer::disable)
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Configure authorization for each endpoint
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - allow without authentication
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/songs").permitAll()
                .requestMatchers("/api/songs/search/**").permitAll()
                .requestMatchers("/api/songs/{id}").permitAll()
                .requestMatchers("/api/test/public").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/error").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            // Stateless session management (JWT based)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Configure authentication provider
            .authenticationProvider(authenticationProvider)
            // Add JWT auth filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // Allow iframe embedding for H2 console
            .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Allow these headers in requests
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Allow these headers in response
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        
        // Allow cookies
        configuration.setAllowCredentials(true);
        
        // How long the preflight requests can be cached
        configuration.setMaxAge(3600L);
        
        // Apply this configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
} 