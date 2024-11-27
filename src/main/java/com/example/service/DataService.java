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
        data.setDataContent(dataRequest.getDataContent());
        data.setCreatedAt(LocalDateTime.now());
        data.setUpdatedAt(LocalDateTime.now());
        return dataRepository.save(data);
    }
}

