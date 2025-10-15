package com.example.server.Controller;



import com.example.server.DTO.Request.EmployeeRequest;
import com.example.server.DTO.Respone.EmployeeResponse;
import com.example.server.Services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @PostMapping
    public EmployeeResponse create(@RequestBody EmployeeRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<EmployeeResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Integer id, @RequestBody EmployeeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

