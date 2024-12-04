package com.example.controller;

import com.example.entity.Data;
import com.example.entity.User;
import com.example.model.DataRequest;
import com.example.repository.DataRepository;
import com.example.repository.UserRepository;
import com.example.security.CustomUserDetails;
import com.example.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class DataController {

    private final DataService dataService;
    private final UserRepository userRepository;
    private final DataRepository dataRepository;

    public DataController(DataService dataService, UserRepository userRepository, DataRepository dataRepository) {
        this.dataService = dataService;
        this.userRepository = userRepository;
        this.dataRepository = dataRepository;
    }

    // 添加数据的 API
    //**未进行错误提示处理，后期可优化**
    @PostMapping("/upload")
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

    @GetMapping("/{dataID}")
    public ResponseEntity<?> getDataById(@PathVariable String dataID, @RequestHeader("Authorization") String token) {
        try {
            //将dataID转换为Integer
            Integer dataid = Integer.parseInt(dataID);

            // 从数据库中查找数据
            Optional<Data> optionalData = dataRepository.findById(dataid);

            if (optionalData.isPresent()) {
                return ResponseEntity.ok(optionalData.get()); // 返回数据
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("数据未找到");
            }
        } catch (Exception e) {
            // 捕获异常并返回 500 错误
            System.out.println("服务器内部错误: " +e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服务器内部错误: " + e.getMessage());
        }
    }

    //编辑指定数据
    @PutMapping("/{dataID}")
    public ResponseEntity<?> updateData(@PathVariable Long dataID, @RequestBody DataRequest dataRequest) {

        Optional<Data> optionalData = dataRepository.findById(Math.toIntExact(dataID));
        if (optionalData.isPresent()) {
            Data data = optionalData.get();
            data.setDataName(dataRequest.getDataName());
            data.setDataContent(dataRequest.getDataContent());
            data.setCreatedAt(dataRequest.getCreatedAt());
            data.setUpdatedAt(dataRequest.getUpdatedAt());

            dataRepository.save(data);
            return ResponseEntity.ok("数据更新成功");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("数据未找到");
        }
    }


    //删除指定数据
    @DeleteMapping("/{dataID}")
    public ResponseEntity<Void> deleteData(@PathVariable Long dataID) {
        boolean deleted = dataService.deleteDataById(dataID);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // 获取所有数据的方法
    @GetMapping("/all")
    public ResponseEntity<List<Data>> getAllData() {
        try {
            List<Data> allData = dataService.getAllData();
            return new ResponseEntity<>(allData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
