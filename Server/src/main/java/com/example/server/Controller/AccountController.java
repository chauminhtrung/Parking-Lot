package com.example.server.Controller;


import com.example.server.DTO.Request.AccountRequest;
import com.example.server.DTO.Respone.AccountResponse;
import com.example.server.Services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService service;

    @PostMapping
    public AccountResponse create(@RequestBody AccountRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AccountResponse update(@PathVariable Integer id, @RequestBody AccountRequest request) {
        return service.update(id, request);
    }

    @GetMapping
    public List<AccountResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AccountResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @PostMapping("/login")
    public ResponseEntity<AccountResponse> login(@RequestBody AccountRequest request) {
        AccountResponse res = service.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(res); // đảm bảo trả về JSON
    }


}

