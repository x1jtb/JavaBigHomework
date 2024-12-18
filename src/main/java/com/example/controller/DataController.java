package com.example.controller;

import com.example.entity.Data;
import com.example.entity.User;
import com.example.model.DataRequest;
import com.example.repository.DataRepository;
import com.example.repository.UserRepository;
import com.example.security.CustomUserDetails;
import com.example.service.DataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

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
    // 使用异步方法处理数据上传，减少主线程阻塞
    //**未进行错误提示处理，后期可优化**
    @PostMapping("/upload")


    public CompletableFuture<ResponseEntity<?>> addData(@RequestBody DataRequest dataRequest) {
        return CompletableFuture.supplyAsync(() -> {
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
        });
    }

    //查找指定数据
    @GetMapping("/{dataID}")
    public ResponseEntity<?> getDataById(@PathVariable String dataID) {
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
                return ResponseEntity.badRequest().body("用户未找到");
            }

            Integer userID = user.get().getId().intValue();

            // 将 dataID 转换为 Integer
            Integer dataId = Integer.parseInt(dataID);

            // 根据 dataID 和 userID 查找数据
            Optional<Data> optionalData = dataRepository.findById(dataId);
            if (optionalData.isPresent()) {
                Data data = optionalData.get();

                // 验证数据是否属于当前用户
                if (!data.getUserID().equals(userID)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无权查看该数据");
                }

                return ResponseEntity.ok(data); // 返回数据

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("数据未找到");
            }

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("无效的 dataID: " + dataID);
        } catch (Exception e) {
            // 捕获异常并返回 500 错误
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服务器内部错误: " + e.getMessage());
        }
    }


    // 编辑指定数据
    @PutMapping("/{dataID}")
    public ResponseEntity<?> updateData(@PathVariable Long dataID, @RequestBody DataRequest dataRequest) {
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
                return ResponseEntity.badRequest().body("用户未找到");
            }

            Integer userID = user.get().getId().intValue();

            // 查找指定 dataID 和 userID 的数据
            Optional<Data> optionalData = dataRepository.findById(dataID.intValue());
            if (optionalData.isPresent()) {
                Data data = optionalData.get();

                // 验证数据是否属于当前用户
                if (!data.getUserID().equals(userID)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无权编辑该数据");
                }

                // 更新数据内容
                data.setDataName(dataRequest.getDataName());        // 更新数据标题
                data.setDataContent(dataRequest.getDataContent());  // 更新数据内容
                data.setUpdatedAt(LocalDateTime.now());             // 更新修改日期为当前系统时间
                data.setFileContent(dataRequest.getFileContent());

                dataRepository.save(data); // 保存修改后的数据
                return ResponseEntity.ok("数据更新成功");

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("数据未找到");
            }

        } catch (Exception e) {
            // 捕获异常并返回 500 错误
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服务器内部错误: " + e.getMessage());
        }
    }



    // 删除指定数据
    @DeleteMapping("/{dataID}")
    public ResponseEntity<?> deleteData(@PathVariable Long dataID) {
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
                return ResponseEntity.badRequest().body("用户未找到");
            }

            Integer userID = user.get().getId().intValue();

            // 查找指定 dataID 和 userID 的数据
            Optional<Data> optionalData = dataRepository.findById(dataID.intValue());
            if (optionalData.isPresent()) {
                Data data = optionalData.get();

                // 验证数据是否属于当前用户
                if (!data.getUserID().equals(userID)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无权删除该数据");
                }

                // 删除数据
                dataRepository.delete(data);
                return ResponseEntity.ok("数据删除成功");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("数据未找到");
            }

        } catch (Exception e) {
            // 捕获异常并返回 500 错误
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("服务器内部错误: " + e.getMessage());
        }
    }


    // 获取所有数据的方法
    @GetMapping("/all")
    public ResponseEntity<?> getAllData() {
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
                return ResponseEntity.badRequest().body("用户未找到");
            }

            // 查询属于该用户的所有数据
            List<Data> allData = dataRepository.findByUserID(user.get().getId().intValue());
            return new ResponseEntity<>(allData, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("服务器内部错误: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*// 获取所有数据的方法
    //获取所有用户的数据，用来测试删除数据的api是否考虑userid，验证安全性
    @GetMapping("/all")
    public ResponseEntity<List<Data>> getAllData() {
        try {
            List<Data> allData = dataService.getAllData();
            return new ResponseEntity<>(allData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }*/

    // 获取用户上传的所有数据
    @GetMapping("/admin/{userId}/data")
    public ResponseEntity<?> getUserData(@PathVariable Long userId) {
        // 从数据库中查找用户
        Optional<User> userOptional = userRepository.findById(userId);

        if (!userOptional.isPresent()) {
            return ResponseEntity.status(404).body("用户不存在");
        }

        User user = userOptional.get();

        // 获取用户上传的所有数据
        List<Data> userData = dataRepository.findByUserID(user.getId().intValue());

        return ResponseEntity.ok(userData);
    }

    // 编辑用户数据
    @PutMapping("/admin/{dataID}")
    public ResponseEntity<?> updateUserData(@PathVariable Long dataID, @RequestBody DataRequest dataRequest) {
        // 从数据库中查找数据
        Optional<Data> dataOptional = dataRepository.findById(dataID.intValue());

        if (!dataOptional.isPresent()) {
            return ResponseEntity.status(404).body("数据不存在");
        }

        Data data = dataOptional.get();

        // 更新数据内容
        data.setDataName(dataRequest.getDataName());
        data.setDataContent(dataRequest.getDataContent());
        data.setUpdatedAt(LocalDateTime.now());

        // 保存更新后的数据到数据库
        dataRepository.save(data);

        return ResponseEntity.ok("数据已更新");
    }

    // 删除用户数据
    @DeleteMapping("/admin/{dataID}")
    public ResponseEntity<?> deleteUserData(@PathVariable Long dataID) {
        // 从数据库中查找数据
        Optional<Data> dataOptional = dataRepository.findById(dataID.intValue());

        if (!dataOptional.isPresent()) {
            return ResponseEntity.status(404).body("数据不存在");
        }

        Data data = dataOptional.get();

        // 删除数据
        dataRepository.delete(data);

        return ResponseEntity.ok("数据已删除");
    }

}
