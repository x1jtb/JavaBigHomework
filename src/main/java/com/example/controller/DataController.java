package com.example.controller;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class DataController {

    private final UserRepository userRepository;

    public DataController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 新增数据
    @PostMapping("/add")
    public ResponseEntity<String> addData(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body("用户名不能为空");
        }
        userRepository.save(user);
        return ResponseEntity.ok("数据添加成功");
    }

    // 删除数据
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteData(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("数据不存在");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("数据删除成功");
    }

    // 修改数据
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateData(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userRepository.findById(id);
        if (!existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("数据不存在");
        }

        User user = existingUser.get();
        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }
        /*
        修改内容
        if (updatedUser.getContent() != null) {
            user.setContent(updatedUser.getContent());
        }
        */
        userRepository.save(user);

        return ResponseEntity.ok("数据更新成功");
    }

    // 查询所有数据
    @GetMapping("/all")
    public ResponseEntity<Iterable<User>> getAllData() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
