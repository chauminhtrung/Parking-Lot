package com.example.server.Controller;


import com.example.server.DTO.Request.VehicleRequest;
import com.example.server.DTO.Respone.VehicleResponse;
import com.example.server.Services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    @PostMapping
    public VehicleResponse create(@RequestBody VehicleRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<VehicleResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/plate/{plate}")
    public VehicleResponse getByPlate(@PathVariable String plate) {
        return service.getByPlate(plate);
    }

    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Integer id, @RequestBody VehicleRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}

