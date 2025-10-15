package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class    CustomerRequest {
    private String fullName;
    private String phone;
    private String address;
}

