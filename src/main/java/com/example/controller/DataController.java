package com.example.controller;

import com.example.entity.Data;
import com.example.model.DataRequest;
import com.example.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataService dataService;

    // 添加数据的 API
    @PostMapping("/add")
    public ResponseEntity<?> addData(@RequestBody DataRequest dataRequest) {
        try {
            Data data = dataService.addData(dataRequest);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
