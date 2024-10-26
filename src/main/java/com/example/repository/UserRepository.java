package com.example.repository;

import com.example.entity.User; // 导入 User 实体
import org.springframework.data.jpa.repository.JpaRepository; // 导入 JpaRepository
import java.util.Optional; // 导入 Optional

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
