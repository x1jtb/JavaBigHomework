package com.example.model;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class DataRequest {
    private Integer userID;
    private String DataName;
    private String DataContent;
    private String FileContent;
}
