package com.example.server.ServicesImp;


import com.example.server.DTO.Request.ParkingAreaRequest;
import com.example.server.DTO.Respone.ParkingAreaResponse;
import com.example.server.Mapper.ParkingAreaMapper;
import com.example.server.Model.ParkingArea;
import com.example.server.Model.ParkingFloor;
import com.example.server.Repositories.ParkingAreaRepository;
import com.example.server.Repositories.ParkingFloorRepository;
import com.example.server.Services.ParkingAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingAreaServiceImpl implements ParkingAreaService {


    private final ParkingAreaRepository repository;
    private final ParkingAreaMapper mapper;

    @Autowired
    private final ParkingFloorRepository parkingFloorRepository;

    @Override
    public ParkingAreaResponse create(ParkingAreaRequest request) {
        ParkingArea area = new ParkingArea();

        // ✅ Set thủ công các giá trị từ request
        area.setAreaName(request.getAreaName());
        area.setDescription(request.getDescription());
        area.setSpotCount(request.getSpotCount());

        // ✅ Liên kết với floor (nếu có quan hệ)
        ParkingFloor floor = parkingFloorRepository.findById(request.getFloorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tầng với ID: " + request.getFloorId()));
        area.setFloor(floor);

        // ✅ Lưu và trả response
        ParkingArea savedArea = repository.save(area);

        // ✅ Tạo response thủ công
        ParkingAreaResponse response = new ParkingAreaResponse();
        response.setAreaId(savedArea.getAreaId());
        response.setFloorId(savedArea.getFloor().getFloorId());
        response.setAreaName(savedArea.getAreaName());
        response.setDescription(savedArea.getDescription());
        response.setSpotCount(savedArea.getSpotCount());

        return response;
    }


    @Override
    public ParkingAreaResponse update(Integer id, ParkingAreaRequest request) {
        ParkingArea area = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khu vực với ID: " + id));

        area.setAreaName(request.getAreaName());
        area.setDescription(request.getDescription());
        area.setSpotCount(request.getSpotCount());

        ParkingArea updated = repository.save(area);

        ParkingAreaResponse response = new ParkingAreaResponse();
        response.setAreaId(updated.getAreaId());
        response.setFloorId(updated.getFloor().getFloorId());
        response.setAreaName(updated.getAreaName());
        response.setDescription(updated.getDescription());
        response.setSpotCount(updated.getSpotCount());

        return response;
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public List<ParkingAreaResponse> getAll() {
        return repository.findAll().stream().map(area -> {
            ParkingAreaResponse res = new ParkingAreaResponse();
            res.setAreaId(area.getAreaId());
            res.setFloorId(area.getFloor().getFloorId());
            res.setAreaName(area.getAreaName());
            res.setDescription(area.getDescription());
            res.setSpotCount(area.getSpotCount());
            return res;
        }).collect(Collectors.toList());
    }

    @Override
    public ParkingAreaResponse getById(Integer id) {
        ParkingArea area = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khu vực với ID: " + id));

        ParkingAreaResponse res = new ParkingAreaResponse();
        res.setAreaId(area.getAreaId());
        res.setFloorId(area.getFloor().getFloorId());
        res.setAreaName(area.getAreaName());
        res.setDescription(area.getDescription());
        res.setSpotCount(area.getSpotCount());
        return res;
    }

    // 🆕 Hàm lấy danh sách khu vực theo floorId
    @Override
    public List<ParkingAreaResponse> getByFloorId(Integer floorId) {
        List<ParkingArea> areas = repository.findByFloor_FloorId(floorId);

        return areas.stream().map(area -> {
            ParkingAreaResponse res = new ParkingAreaResponse();
            res.setAreaId(area.getAreaId());
            res.setFloorId(area.getFloor().getFloorId());
            res.setAreaName(area.getAreaName());
            res.setDescription(area.getDescription());
            res.setSpotCount(area.getSpotCount());
            return res;
        }).collect(Collectors.toList());
    }
}

