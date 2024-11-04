
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
import com.example.model.AuthRequest; // 确保有 AuthRequest 的导入
import com.example.model.AuthResponse; // 确保有 AuthResponse 的导入

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
    public ResponseEntity<String> testPostRequest() {
        return ResponseEntity.ok("POST request successful");
    }
    /*@PostMapping("/login")
     public ResponseEntity<?> createAuthToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            // 尝试进行用户身份验证
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        // 加载用户信息
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        // 生成 JWT token
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // 返回生成的 JWT token
        return ResponseEntity.ok(new AuthResponse(jwt));
    }*/
}
