package com.example.server.Controller;


import com.example.server.DTO.Request.InvoiceRequest;
import com.example.server.DTO.Respone.InvoiceResponse;
import com.example.server.Services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService service;

    @PostMapping
    public InvoiceResponse create(@RequestBody InvoiceRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<InvoiceResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public InvoiceResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

