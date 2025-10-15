package com.example.server.Controller;


import com.example.server.DTO.Request.ParkingSpotRequest;
import com.example.server.DTO.Respone.ParkingSpotResponse;
import com.example.server.Services.ParkingSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ParkingSpotController {

    private final ParkingSpotService service;

    @PostMapping
    public ParkingSpotResponse create(@RequestBody ParkingSpotRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ParkingSpotResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ParkingSpotResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ParkingSpotResponse update(@PathVariable Integer id, @RequestBody ParkingSpotRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }


    @GetMapping("/area/{areaId}")
    public List<ParkingSpotResponse> getByAreaId(@PathVariable Integer areaId) {
        return service.getByAreaId(areaId);
    }

    @PutMapping("/{spotId}/status")
    public ParkingSpotResponse updateStatus(@PathVariable Integer spotId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            throw new RuntimeException("Status không được để trống!");
        }
        return service.updateStatus(spotId, status);
    }


}
