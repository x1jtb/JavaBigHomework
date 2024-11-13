package com.example.security; // 确保这个包名正确


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import com.example.entity.User; // 自定义的 UserDetails 实现i

import javax.management.relation.Relation;


public class CustomUserDetails implements UserDetails {
    private User user; // 引用您自己的 User 类

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("返回用户权限输出:"+new SimpleGrantedAuthority(user.getRole()));
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole())); // 使用 Collections.singletonList
        // 返回用户权限，您需要根据自己的实现来修改
        //return null;  空为皆可，请替换为实际的权限集合
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }



    public User getUser() {
        return user;
    }
}


