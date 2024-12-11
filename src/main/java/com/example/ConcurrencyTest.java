package com.example;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ConcurrencyTest {

    public static void main(String[] args) {
        int numberOfThreads = 1000;  // 模拟并发的线程数
        String apiUrl = "http://localhost:8080/api/auth/login"; // API接口URL

        ExecutorService executor = Executors.newFixedThreadPool(numberOfThreads);

        // 定义要发送的请求体（JSON格式）
        String jsonBody = "{\"username\":\"admin\", \"password\":\"huangjiaxi666\"}";

        for (int i = 0; i < numberOfThreads; i++) {
            executor.submit(() -> {
                try {
                    // 创建URL对象
                    URL url = new URL(apiUrl);

                    // 打开连接
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                    // 设置请求方法为 POST
                    connection.setRequestMethod("POST");

                    // 设置请求头，表示发送的是JSON数据
                    connection.setRequestProperty("Content-Type", "application/json");
                    connection.setRequestProperty("Accept", "application/json");

                    // 启用输入输出流
                    connection.setDoOutput(true);

                    // 写入请求体
                    try (OutputStream os = connection.getOutputStream()) {
                        byte[] input = jsonBody.getBytes("utf-8");
                        os.write(input, 0, input.length);
                    }

                    // 获取响应码
                    int responseCode = connection.getResponseCode();
                    System.out.println("Response from thread " + Thread.currentThread().getName() + ": " + responseCode);

                    // 关闭连接
                    connection.disconnect();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        executor.shutdown();
    }
}