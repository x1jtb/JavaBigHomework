package com.example.repository;

import com.example.entity.Data;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataRepository extends JpaRepository<Data, Integer> {
    List<Data> findByUserID(Integer UserID); // 这里的 UserID 首字母要大写
}