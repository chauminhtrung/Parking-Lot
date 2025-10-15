package com.example.server.Services;


import com.example.server.DTO.Request.CustomerRequest;
import com.example.server.DTO.Respone.CustomerResponse;

import java.util.List;

public interface CustomerService {
    CustomerResponse create(CustomerRequest request);
    CustomerResponse update(Integer id, CustomerRequest request);
    void delete(Integer id);
    List<CustomerResponse> getAll();
    CustomerResponse getById(Integer id);
}

