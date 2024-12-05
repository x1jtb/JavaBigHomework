package com.example.service;

import com.example.entity.Data;
import com.example.model.DataRequest;
import com.example.repository.DataRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DataService {

    private final DataRepository dataRepository;

    public DataService(DataRepository dataRepository) {
        this.dataRepository = dataRepository;
    }

    public Data addData(DataRequest dataRequest) {
        Data data = new Data();
        data.setUserID(dataRequest.getUserID());
        data.setDataName(dataRequest.getDataName());
        data.setDataContent(dataRequest.getDataContent());
        data.setFileContent(dataRequest.getFileContent());
        data.setCreatedAt(LocalDateTime.now());
        data.setUpdatedAt(LocalDateTime.now());
        return dataRepository.save(data);
    }

    //获取所有用户的数据，用来测试删除数据的api是否考虑userid，验证安全性
    //可先别删
    public List<Data> getAllData() {
        return dataRepository.findAll(); // 确保DataRepository有findAll方法
    }

}

