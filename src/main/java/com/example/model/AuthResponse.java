package com.example.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {
    private String jwt;
    private String redirectUrl; // 新增字段，记录跳转页面的URL

    public AuthResponse(String jwt, String redirectUrl) {
        this.jwt = jwt;
        this.redirectUrl = redirectUrl;
    }

}
