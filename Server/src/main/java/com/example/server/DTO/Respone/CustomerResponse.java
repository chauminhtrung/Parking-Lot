package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class CustomerResponse {
    private Integer customerId;
    private String fullName;
    private String phone;
    private String address;
}

