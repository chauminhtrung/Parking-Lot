package com.example.server.Services;


import com.example.server.DTO.Request.EmployeeRequest;
import com.example.server.DTO.Respone.EmployeeResponse;

import java.util.List;

public interface EmployeeService {
    EmployeeResponse create(EmployeeRequest request);
    EmployeeResponse update(Integer id, EmployeeRequest request);
    void delete(Integer id);
    List<EmployeeResponse> getAll();
    EmployeeResponse getById(Integer id);
}

