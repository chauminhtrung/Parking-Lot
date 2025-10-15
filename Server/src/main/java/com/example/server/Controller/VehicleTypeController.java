package com.example.server.Controller;


import com.example.server.DTO.Request.VehicleTypeRequest;
import com.example.server.DTO.Respone.VehicleTypeResponse;
import com.example.server.Services.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService service;

    @PostMapping
    public VehicleTypeResponse create(@RequestBody VehicleTypeRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<VehicleTypeResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VehicleTypeResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public VehicleTypeResponse update(@PathVariable Integer id, @RequestBody VehicleTypeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

