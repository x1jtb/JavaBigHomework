package com.example;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderDemo {
    public static void main(String[] args) {
        // 创建 BCryptPasswordEncoder 实例
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // 明文密码
        String rawPassword = "";

        // 对密码进行加密
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 打印加密后的密码
        System.out.println("Encoded Password: " + encodedPassword);
    }
}
