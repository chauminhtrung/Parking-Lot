package com.example.server.Controller;


import com.example.server.DTO.Request.ParkingAreaRequest;
import com.example.server.DTO.Respone.ParkingAreaResponse;
import com.example.server.Services.ParkingAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ParkingAreaController {

    private final ParkingAreaService service;

    @PostMapping
    public ParkingAreaResponse create(@RequestBody ParkingAreaRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ParkingAreaResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ParkingAreaResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ParkingAreaResponse update(@PathVariable Integer id, @RequestBody ParkingAreaRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    // 🆕 Lấy danh sách khu vực theo floorId
    @GetMapping("/floor/{floorId}")
    public List<ParkingAreaResponse> getByFloorId(@PathVariable Integer floorId) {
        return service.getByFloorId(floorId);
    }



}

