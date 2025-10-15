package com.example.server.ServicesImp;


import com.example.server.DTO.Request.ParkingSpotRequest;
import com.example.server.DTO.Respone.ParkingSpotResponse;
import com.example.server.Mapper.ParkingSpotMapper;
import com.example.server.Model.ParkingArea;
import com.example.server.Model.ParkingLot;
import com.example.server.Model.ParkingSpot;
import com.example.server.Repositories.ParkingAreaRepository;
import com.example.server.Repositories.ParkingSpotRepository;
import com.example.server.Services.ParkingSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingSpotServiceImpl implements ParkingSpotService {


    private final ParkingSpotRepository repository;
    private final ParkingSpotMapper mapper;

    @Autowired
    private final ParkingAreaRepository parkingAreaRepository;

    @Override
    public ParkingSpotResponse create(ParkingSpotRequest request) {
        // Kiểm tra areaId hợp lệ
        if (request.getAreaId() == null) {
            throw new RuntimeException("⚠️ areaId không được để trống!");
        }
        // Tạo entity mới thủ công
        ParkingSpot spot = new ParkingSpot();
        ParkingArea parkingArea = parkingAreaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bãi đỗ với ID: " +request.getAreaId()));
        spot.setArea(parkingArea);
        spot.setSpotCode(request.getSpotCode());
        spot.setStatus(
                (request.getStatus() != null && !request.getStatus().isEmpty())
                        ? request.getStatus()
                        : "Empty"
        );

        // Lưu vào DB
        ParkingSpot saved = repository.save(spot);

        // Tạo response thủ công
        ParkingSpotResponse response = new ParkingSpotResponse();
        response.setSpotId(saved.getSpotId());
        response.setAreaId(saved.getArea().getAreaId());
        response.setSpotCode(saved.getSpotCode());
        response.setStatus(saved.getStatus());

        return response;
    }


    @Override
    public ParkingSpotResponse update(Integer id, ParkingSpotRequest request) {
        ParkingSpot spot = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chỗ đỗ"));
        mapper.updateEntityFromDto(request, spot);
        return mapper.toResponse(repository.save(spot));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public List<ParkingSpotResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParkingSpotResponse getById(Integer id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chỗ đỗ"));
    }


    @Override
    public List<ParkingSpotResponse> getByAreaId(Integer areaId) {
        List<ParkingSpot> spots = repository.findByArea_AreaId(areaId);

        return spots.stream().map(spot -> {
            ParkingSpotResponse res = new ParkingSpotResponse();
            res.setSpotId(spot.getSpotId());
            res.setAreaId(spot.getArea().getAreaId());
            res.setSpotCode(spot.getSpotCode());
            res.setStatus(spot.getStatus());
            return res;
        }).collect(Collectors.toList());
    }

    @Override
    public ParkingSpotResponse updateStatus(Integer spotId, String status) {
        ParkingSpot spot = repository.findById(spotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chỗ đỗ với ID: " + spotId));

        spot.setStatus(status); // Cập nhật status
        ParkingSpot saved = repository.save(spot); // Lưu vào DB

        // Tạo response thủ công
        ParkingSpotResponse response = new ParkingSpotResponse();
        response.setSpotId(saved.getSpotId());
        response.setAreaId(saved.getArea().getAreaId());
        response.setSpotCode(saved.getSpotCode());
        response.setStatus(saved.getStatus());

        return response;
    }




}

