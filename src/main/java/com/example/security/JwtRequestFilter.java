package com.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.service.UserDetailsServiceImpl; // 确保正确的包名
import com.example.util.JwtUtil; // 确保正确的包名

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // 检查是否有授权头
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            //System.out.println("1.检查是否执行");
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
        }

        // 如果用户名存在且当前没有用户认证
        if ((username != null && SecurityContextHolder.getContext().getAuthentication() == null)) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            //System.out.println("2.检查是否执行并输出:"+userDetails.getAuthorities());
            // 检查 token 是否有效
            if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {
               //System.out.println("3.检查是否执行并输出:"+userDetails.getAuthorities());
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        //System.out.println("Authorization Header: " + authorizationHeader);
        //System.out.println("Extracted Username: " + username);
        //System.out.println("Jwt: " + jwt);

        chain.doFilter(request, response); // 继续过滤器链
    }
}
