package com.example.repository;

import com.example.entity.Data;//导入Data实体
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // 导入 Optional

public interface DataRepository extends JpaRepository<Data, Long> {
}