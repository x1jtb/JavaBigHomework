package com.example.controller;

import com.example.entity.Data;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.security.CustomUserDetails;
import com.example.repository.DataRepository;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DataRepository dataRepository;

    // 使用构造函数注入依赖项  
    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService, UserRepository userRepository, PasswordEncoder passwordEncoder, DataRepository dataRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dataRepository = dataRepository;
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
        newUser.setRole("USER");  //设置默认注册用户权限为USER

        // 保存用户到数据库
        userRepository.save(newUser);

        // 返回成功注册的响应
        return ResponseEntity.status(201).body("User registered successfully");
    }

    @PostMapping("/authority/admin")
    public ResponseEntity<?> authority(@RequestBody AuthRequest authRequest) {
        // 返回权限认证成功的响应
        System.out.println("成功接受到admin请求!"); //在服务器输出权限认证成功信息
        return ResponseEntity.ok("管理员认证成功!");
    }

    @PostMapping("/authority/user")
    public ResponseEntity<?> user(@RequestBody AuthRequest authRequest) {
        // 返回权限认证成功的响应
        System.out.println("成功接受到user请求!"); //在服务器输出权限认证成功信息
        return ResponseEntity.ok("用户认证成功!");
    }

    // 从数据库中获取所有用户
    @GetMapping("/admin/getusers")
    public ResponseEntity<?> getAllUsers() {

        List<User> users = userRepository.findAll();

        // 只返回用户名和 ID
        List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    return userMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    //修改用户名
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateUsername(@PathVariable Long id, @RequestBody Map<String, String> request) {
        // 从数据库中查找用户
        Optional<User> userOptional = userRepository.findById(id);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(404).body("用户不存在");
        }

        User user = userOptional.get();

        // 检查新用户名是否已经存在
        String newUsername = request.get("username");
        if (userRepository.findByUsername(newUsername).isPresent()) {
            return ResponseEntity.status(400).body("用户名已存在，请选择其他用户名");
        }

        // 更新用户名
        user.setUsername(newUsername);

        // 保存更新后的用户到数据库
        userRepository.save(user);

        return ResponseEntity.ok("用户名已更新");
    }

    //删除用户
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // 从数据库中查找用户
        Optional<User> userOptional = userRepository.findById(id);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(404).body("用户不存在");
        }

        User user = userOptional.get();

        // 检查用户角色是否为 ADMIN
        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body("无法删除管理员用户");
        }

        // 删除用户关联的所有数据
        List<Data> userData = dataRepository.findByUserID(user.getId().intValue());
        dataRepository.deleteAll(userData);

        // 删除用户
        userRepository.delete(user);

        return ResponseEntity.ok("用户及其关联数据已删除");
    }
}