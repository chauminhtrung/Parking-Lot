package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class AccountResponse {
    private Integer accountId;
    private String username;
    private String role;
}

