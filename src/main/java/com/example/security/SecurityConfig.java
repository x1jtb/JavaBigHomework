package com.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.service.UserDetailsServiceImpl; // 确保正确的包名
import com.example.util.JwtUtil; // 确保正确的包名

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtUtil jwtUtil; // 确保有 JwtUtil 的 Bean

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // 确保有 UserDetailsServiceImpl 的 Bean

    @Autowired
    private JwtRequestFilter jwtRequestFilter; // 注入 JwtRequestFilter

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 使用 UserDetailsService 和 PasswordEncoder 进行身份验证
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable() // 禁用 CSRF 保护
                .authorizeRequests()
                .antMatchers("/", "/index.html", "/api/auth/login", "/css/**", "/js/**","/images/**","/data-management.html").permitAll() // 允许所有人访问 index.html 和登录接口
                .anyRequest().authenticated() // 其他请求需要认证
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 不使用 session

        // 添加 JWT 过滤器
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean(); // 返回 AuthenticationManager 的 Bean
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 创建 BCryptPasswordEncoder 的 Bean
    }
}
