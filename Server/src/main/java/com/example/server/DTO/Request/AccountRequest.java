package com.example.server.DTO.Request;


import lombok.Data;

@Data
public class AccountRequest {
    private String username;
    private String password;
    private String role;
}

