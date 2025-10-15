package com.example.server.ServicesImp;

import com.example.server.DTO.Request.VehicleTypeRequest;
import com.example.server.DTO.Respone.VehicleTypeResponse;
import com.example.server.Model.VehicleType;
import com.example.server.Repositories.VehicleTypeRepository;
import com.example.server.Services.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository repository;

    // ✳️ Chuyển từ Entity → Response
    private VehicleTypeResponse toResponse(VehicleType entity) {
        VehicleTypeResponse res = new VehicleTypeResponse();
        res.setTypeId(entity.getTypeId());
        res.setTypeName(entity.getTypeName());
        res.setPricePerHour(entity.getPricePerHour());
        return res;
    }

    // ✳️ Chuyển từ Request → Entity
    private VehicleType toEntity(VehicleTypeRequest req) {
        VehicleType entity = new VehicleType();
        entity.setTypeName(req.getTypeName());
        entity.setPricePerHour(req.getPricePerHour());
        return entity;
    }

    @Override
    public VehicleTypeResponse create(VehicleTypeRequest request) {
        VehicleType type = toEntity(request);
        VehicleType saved = repository.save(type);
        return toResponse(saved);
    }

    @Override
    public VehicleTypeResponse update(Integer id, VehicleTypeRequest request) {
        VehicleType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại xe có ID: " + id));
        type.setTypeName(request.getTypeName());
        type.setPricePerHour(request.getPricePerHour());
        return toResponse(repository.save(type));
    }

    @Override
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy loại xe để xóa");
        }
        repository.deleteById(id);
    }

    @Override
    public List<VehicleTypeResponse> getAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleTypeResponse getById(Integer id) {
        VehicleType type = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại xe có ID: " + id));
        return toResponse(type);
    }
}
