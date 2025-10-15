package com.example.server.Controller;

import com.example.server.DTO.Request.ParkingLotRequest;
import com.example.server.DTO.Respone.ParkingLotResponse;
import com.example.server.Services.ParkingLotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ParkingLotController {

    private final ParkingLotService service;

    @PostMapping
    public ParkingLotResponse create(@RequestBody ParkingLotRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ParkingLotResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ParkingLotResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ParkingLotResponse update(@PathVariable Integer id, @RequestBody ParkingLotRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/account/{accountId}")
    public List<ParkingLotResponse> getByAccountId(@PathVariable Integer accountId) {
        return service.getByAccountId(accountId);
    }


}
