package com.example.controller;

import com.example.entity.Data;
import com.example.entity.User;
import com.example.model.DataRequest;
import com.example.repository.UserRepository;
import com.example.security.CustomUserDetails;
import com.example.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataService dataService;
    private final UserRepository userRepository;

    public DataController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 添加数据的 API
    //**未进行错误提示处理，后期可优化**
    @PostMapping("/add")
    public ResponseEntity<?> addData(@RequestBody DataRequest dataRequest) {
        try {
            // 获取当前认证对象
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;

            // 检查 principal 的类型
            if (principal instanceof CustomUserDetails) {
                username = ((CustomUserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                username = (String) principal;
            } else {
                return ResponseEntity.badRequest().body("Invalid authentication data");
            }

            // 使用 UserRepository 查找用户
            Optional<User> user = userRepository.findByUsername(username);
            if (!user.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // 将 userID 注入到 dataRequest 中
            dataRequest.setUserID(user.get().getId().intValue());

            // 保存数据
            Data data = dataService.addData(dataRequest);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
