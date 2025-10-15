package com.example.server.Controller;



import com.example.server.DTO.Request.ParkingFloorRequest;
import com.example.server.DTO.Respone.ParkingFloorResponse;
import com.example.server.Services.ParkingFloorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/floors")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ParkingFloorController {

    private final ParkingFloorService service;

    @PostMapping
    public ParkingFloorResponse create(@RequestBody ParkingFloorRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ParkingFloorResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ParkingFloorResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ParkingFloorResponse update(@PathVariable Integer id, @RequestBody ParkingFloorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }


    // 🟢 Thêm mới endpoint để lấy tầng theo lotId
    @GetMapping("/lot/{lotId}")
    public List<ParkingFloorResponse> getByLotId(@PathVariable Integer lotId) {
        return service.getByLotId(lotId);
    }

    @GetMapping("/lot/{lotId}/floor/{floorNumber}")
    public ParkingFloorResponse getByLotIdAndFloorNumber(
            @PathVariable Integer lotId,
            @PathVariable Integer floorNumber) {
        return service.getByLotIdAndFloorNumber(lotId, floorNumber);
    }




}

