package com.example.server.DTO.Respone;


import lombok.Data;

@Data
public class EmployeeResponse {
    private Integer employeeId;
    private String fullName;
    private String position;
}
