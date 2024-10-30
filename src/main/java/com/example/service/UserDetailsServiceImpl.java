
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.entity.User; // 自定义的 UserDetails 实现i
import com.example.repository.UserRepository; // 用于与用户数据交互的仓库
import com.example.security.CustomUserDetails; // 确保包名正确



@Service // 确保添加了这个注解
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // 假设您有一个 UserRepository 用于访问用户数据

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库加载用户
        User user = userRepository.findByUsername(username).get(); // 替换为实际的查找方法

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // 返回实现了 UserDetails 接口的对象
        return new CustomUserDetails(user); // 假设您有一个 CustomUserDetails 类
    }
}
