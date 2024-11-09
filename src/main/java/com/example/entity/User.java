package com.example.entity; // 确保正确的包声明

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*; // 导入 JPA 注解
import java.io.Serializable; // 可选：如果您需要实现 Serializable 接口

@Setter
@Getter
@Entity
@Table(name = "users") // 可选：定义表名
public class User implements Serializable { // 可选：实现 Serializable 接口

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // 确保用户名不能为空
    private String username;

    @Column(nullable = false) // 确保密码不能为空
    private String password;

    // Getters and Setters
    /*使用了@Setter和@Getter简化
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public Long getId() {
        return id;
    }*/

}
