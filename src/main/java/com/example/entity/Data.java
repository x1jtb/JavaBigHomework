package com.example.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "data")
public class Data { // 保留类名 Data，但手动实现所需方法
    // 手动实现 getter 和 setter 方法
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer DataID;

    private Integer UserID;

    @Column(length = 20)
    private String DataName;

    @Lob
    private String DataContent;

    private LocalDateTime CreatedAt;

    private LocalDateTime UpdatedAt;

    @Override
    public String toString() {
        return "Data{" +
                "DataID=" + DataID +
                ", UserID=" + UserID +
                ", DataName='" + DataName + '\'' +
                ", DataContent='" + DataContent + '\'' +
                ", CreatedAt=" + CreatedAt +
                ", UpdatedAt=" + UpdatedAt +
                '}';
    }
}

