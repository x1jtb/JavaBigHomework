package com.example.entity; // 确保正确的包声明

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*; // 导入 JPA 注解
import java.io.Serializable; // 可选：如果您需要实现 Serializable 接口
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "data")
public class Data implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long DataId;

    @Column(nullable = false)
    private String DataName;

    @Column(columnDefinition = "TEXT")
    private String DataContent;

    //@CreationTimestamp // 自动生成创建时间
    @Column(name = "CreatedAt", updatable = false) // updatable = false 表示此字段不可更新
    private LocalDateTime createdTime;

    //@UpdateTimestamp // 自动更新修改时间
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedTime;

}
