package com.example.server.Controller;


import com.example.server.DTO.Request.CustomerRequest;
import com.example.server.DTO.Respone.CustomerResponse;
import com.example.server.Services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public CustomerResponse create(@RequestBody CustomerRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<CustomerResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable Integer id, @RequestBody CustomerRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

