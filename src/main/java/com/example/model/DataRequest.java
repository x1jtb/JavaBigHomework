package com.example.model;

import lombok.Data;

@Data
public class DataRequest {
    private Integer userID;
    private String DataName;
    private String DataContent;
    private String FileContent;
}
