package com.example.server.Services;



import com.example.server.DTO.Request.AccountRequest;
import com.example.server.DTO.Respone.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse create(AccountRequest request);
    AccountResponse update(Integer id, AccountRequest request);
    void delete(Integer id);
    List<AccountResponse> getAll();
    AccountResponse getById(Integer id);
    AccountResponse getByUsername(String username);
    AccountResponse login(String username, String password);
}
