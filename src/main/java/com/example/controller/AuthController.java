package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.util.JwtUtil;
import com.example.service.UserDetailsServiceImpl;
import com.example.model.AuthRequest;
import com.example.model.AuthResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    // 使用构造函数注入依赖项  
    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Received login request for user: " + authRequest.getUsername());

        try {
            // 尝试进行用户身份验证  
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            System.out.println("User " + authRequest.getUsername() + " authenticated successfully.");
        } catch (BadCredentialsException e) {
            System.err.println("Authentication failed for user: " + authRequest.getUsername() + " - Incorrect username or password.");
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        // 加载用户信息  
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        System.out.println("Loaded user details for user: " + userDetails.getUsername());

        // 生成 JWT token  
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        System.out.println("Generated JWT token for user: " + userDetails.getUsername());

        // 返回生成的 JWT token  
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}