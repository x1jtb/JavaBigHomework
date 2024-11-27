package com.example.service;

import com.example.entity.Data;
import com.example.model.DataRequest;
import com.example.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DataService {

    @Autowired
    private DataRepository dataRepository;

    public Data addData(DataRequest dataRequest) {
        Data data = new Data();
        data.setUserID(dataRequest.getUserID());
        data.setDataName(dataRequest.getDataName());
        System.out.println("DataName="+dataRequest.getDataName());//测试输出
        data.setDataContent(dataRequest.getDataContent());
        System.out.println("DataContent="+dataRequest.getDataContent());//测试输出
        data.setFileContent(dataRequest.getFileContent());
        data.setCreatedAt(LocalDateTime.now());
        data.setUpdatedAt(LocalDateTime.now());
        return dataRepository.save(data);
    }
}

