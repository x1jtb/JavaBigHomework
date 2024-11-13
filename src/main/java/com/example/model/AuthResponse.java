package com.example.model;

public class AuthResponse {
    private String jwt;
    private String redirectUrl; // 新增字段，记录跳转页面的URL

    public AuthResponse(String jwt, String redirectUrl) {
        this.jwt = jwt;
        this.redirectUrl = redirectUrl;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
