package com.example.controller;

import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 使用构造函数注入依赖项  
    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

        // 获取用户角色
        String role = ((CustomUserDetails) userDetails).getUser().getRole();

        System.out.println(role); //输出用户权限

        // 判断角色并跳转到相应的页面
        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(new AuthResponse(jwt, "/admin.html"));
        } else {
            return ResponseEntity.ok(new AuthResponse(jwt, "/data-management.html"));
        }

        // 返回生成的 JWT token  
        //return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(authRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body("Username already exists");
        }

        // 创建新用户并设置密码加密
        User newUser = new User();
        newUser.setUsername(authRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(authRequest.getPassword()));

        // 保存用户到数据库
        userRepository.save(newUser);

        // 返回成功注册的响应
        return ResponseEntity.status(201).body("User registered successfully");
    }

    @PostMapping("/authority/admin")
    public ResponseEntity<?> authority(@RequestBody AuthRequest authRequest) {
        // 返回权限认证成功的响应
        System.out.println("成功接受到admin请求!");
        return ResponseEntity.ok("管理员认证成功!");
    }

    @PostMapping("/authority/user")
    public ResponseEntity<?> user(@RequestBody AuthRequest authRequest) {
        // 返回权限认证成功的响应
        return ResponseEntity.ok("用户认证成功!");
    }

}