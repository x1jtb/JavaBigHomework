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

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint; // 处理未授权访问的响应

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 使用 UserDetailsService 和 PasswordEncoder 进行身份验证
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable() // 禁用 CSRF 保护
                .authorizeRequests()
                .antMatchers("/index.html").permitAll()  //放行/index.html，不需要认证
                .antMatchers("/api/auth/authority/admin").hasAuthority("ADMIN") //进入该页面需要管理员身份
                .antMatchers("/api/auth/authority/user").hasAnyAuthority("ADMIN","USER") // 进入该页面需要登录
                .antMatchers("/","/api/data/**","/register.html","/api/auth/register","/api/auth/login", "/css/**", "/js/**","/images/**").permitAll() // 允许所有人访问 loginlogin.html 和登录接口
                .antMatchers("/admin.html","/data-management.html").permitAll()
                .anyRequest().authenticated() // 其他请求需要认证
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint) // 处理未授权访问
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
