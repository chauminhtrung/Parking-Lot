package com.example.server.ServicesImp;


import com.example.server.DTO.Request.ParkingFloorRequest;
import com.example.server.DTO.Respone.ParkingFloorResponse;
import com.example.server.Mapper.ParkingFloorMapper;
import com.example.server.Model.ParkingFloor;
import com.example.server.Model.ParkingLot;
import com.example.server.Repositories.ParkingFloorRepository;
import com.example.server.Repositories.ParkingLotRepository;
import com.example.server.Services.ParkingFloorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingFloorServiceImpl implements ParkingFloorService {

    private final ParkingFloorRepository repository;
    private final ParkingFloorMapper mapper;

    @Autowired
    private ParkingLotRepository parkingLotRepository;

    @Override
    public ParkingFloorResponse create(ParkingFloorRequest request) {
        // 🔹 Tạo entity thủ công
        ParkingFloor floor = new ParkingFloor();
        floor.setFloorNumber(request.getFloorNumber());
        floor.setDescription(request.getDescription());

        // 🔹 Tìm ParkingLot theo lotId
        ParkingLot lot = parkingLotRepository.findById(request.getLotId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bãi đỗ với ID: " + request.getLotId()));

        // 🔹 Gán quan hệ
        floor.setParkingLot(lot);

        // 🔹 Lưu vào DB
        ParkingFloor saved = repository.save(floor);

        // 🔹 Tạo response thủ công (nếu không dùng mapper)
        ParkingFloorResponse response = new ParkingFloorResponse();
        response.setFloorId(saved.getFloorId());
        response.setFloorNumber(saved.getFloorNumber());
        response.setDescription(saved.getDescription());
        response.setLotId(saved.getParkingLot().getLotId());

        return response;
    }



    @Override
    public ParkingFloorResponse update(Integer id, ParkingFloorRequest request) {
        ParkingFloor floor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tầng"));
        mapper.updateEntityFromDto(request, floor);
        return mapper.toResponse(repository.save(floor));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public List<ParkingFloorResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParkingFloorResponse getById(Integer id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tầng"));
    }

    @Override
    public List<ParkingFloorResponse> getByLotId(Integer lotId) {
        List<ParkingFloor> floors = repository.findByParkingLot_LotId(lotId);

        return floors.stream()
                .map(floor -> {
                    ParkingFloorResponse response = new ParkingFloorResponse();
                    response.setFloorId(floor.getFloorId());
                    response.setFloorNumber(floor.getFloorNumber());
                    response.setDescription(floor.getDescription());
                    response.setLotId(floor.getParkingLot().getLotId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ParkingFloorResponse getByLotIdAndFloorNumber(Integer lotId, Integer floorNumber) {
        ParkingFloor floor = repository.findByParkingLot_LotIdAndFloorNumber(lotId, floorNumber)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tầng " + floorNumber + " của bãi xe có ID: " + lotId));

        ParkingFloorResponse response = new ParkingFloorResponse();
        response.setFloorId(floor.getFloorId());
        response.setFloorNumber(floor.getFloorNumber());
        response.setDescription(floor.getDescription());
        response.setLotId(floor.getParkingLot().getLotId());

        return response;
    }


}

