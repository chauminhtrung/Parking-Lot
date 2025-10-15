package com.example.server.ServicesImp;


import com.example.server.DTO.Request.AccountRequest;
import com.example.server.DTO.Respone.AccountResponse;
import com.example.server.Mapper.AccountMapper;
import com.example.server.Model.Account;
import com.example.server.Repositories.AccountRepository;
import com.example.server.Services.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    public AccountResponse create(AccountRequest request) {
        Account acc = new Account();
        acc.setUsername(request.getUsername());
        acc.setRole(request.getRole());

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(request.getPassword().getBytes(StandardCharsets.UTF_8));
            acc.setPasswordHash(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }

        Account saved = accountRepository.save(acc);

        AccountResponse response = new AccountResponse();
        response.setAccountId(saved.getAccountId());
        response.setUsername(saved.getUsername());
        response.setRole(saved.getRole());
        return response;
    }


    @Override
    public AccountResponse update(Integer id, AccountRequest request) {
        Account acc = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        accountMapper.updateEntityFromDto(request, acc);
        return accountMapper.toResponse(accountRepository.save(acc));
    }

    @Override
    public void delete(Integer id) {
        accountRepository.deleteById(id);
    }

    @Override
    public List<AccountResponse> getAll() {
        return accountRepository.findAll()
                .stream().map(accountMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getById(Integer id) {
        return accountRepository.findById(id)
                .map(accountMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
    }

    @Override
    public AccountResponse getByUsername(String username) {
        return accountMapper.toResponse(accountRepository.findByUsername(username));
    }

    @Override
    public AccountResponse login(String username, String password) {
        Account acc = accountRepository.findByUsername(username);
        if (acc == null) {
            throw new RuntimeException("Tài khoản không tồn tại");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));

            // So sánh mảng byte
            if (!Arrays.equals(hash, acc.getPasswordHash())) {
                throw new RuntimeException("Sai mật khẩu");
            }

            AccountResponse response = accountMapper.toResponse(acc);
            System.out.println(response); // xem dữ liệu có null không
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xác thực tài khoản", e);
        }
    }

}

