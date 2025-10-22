package com.example.server.ServicesImp;

import com.example.server.DTO.Request.VehicleRequest;
import com.example.server.DTO.Respone.VehicleResponse;
import com.example.server.Model.Customer;
import com.example.server.Model.Vehicle;
import com.example.server.Model.VehicleType;
import com.example.server.Repositories.CustomerRepository;
import com.example.server.Repositories.VehicleRepository;
import com.example.server.Repositories.VehicleTypeRepository;
import com.example.server.Services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repository;

    @Autowired
    private final VehicleTypeRepository vehicleTypeRepo;
    @Autowired
    private final CustomerRepository customerRepo;
    // ---------------------
    // Helpers chuyển đổi
    // ---------------------
    private Vehicle toEntity(VehicleRequest req) {
        Vehicle v = new Vehicle();
        v.setPlateNumber(req.getPlateNumber());

        // Lấy VehicleType từ DB
        VehicleType type = vehicleTypeRepo.findById(req.getTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại xe với ID: " + req.getTypeId()));
        v.setType(type);

        // Lấy Customer từ DB
        Customer customer = customerRepo.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + req.getCustomerId()));
        v.setCustomer(customer);

        return v;
    }

    private VehicleResponse toResponse(Vehicle entity) {
        VehicleResponse r = new VehicleResponse();
        r.setVehicleId(entity.getVehicleId());
        r.setPlateNumber(entity.getPlateNumber());

        // ✅ Lấy tên loại xe từ liên kết VehicleType
        if (entity.getType() != null) {
            r.setVehicleType(entity.getType().getTypeName());
        } else {
            r.setVehicleType("Unknown");
        }

        // ✅ Lấy tên chủ xe từ liên kết Customer
        if (entity.getCustomer() != null) {
            r.setOwnerName(entity.getCustomer().getFullName());
            r.setOwnerSDT(entity.getCustomer().getPhone());
            r.setOwnerID(entity.getCustomer().getCustomerId());
        } else {
            r.setOwnerName("Unknown");
        }

        return r;
    }


    // ---------------------
    // CRUD
    // ---------------------
    @Override
    public VehicleResponse create(VehicleRequest request) {
        Vehicle vehicle = toEntity(request);
        Vehicle saved = repository.save(vehicle);
        return toResponse(saved);
    }

    @Override
    public VehicleResponse update(Integer id, VehicleRequest request) {
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + id));

        // Cập nhật biển số nếu có
        if (request.getPlateNumber() != null) {
            vehicle.setPlateNumber(request.getPlateNumber());
        }

        // Cập nhật loại xe nếu typeId được gửi
        if (request.getTypeId() != null) {
            VehicleType type = vehicleTypeRepo.findById(request.getTypeId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại xe với ID: " + request.getTypeId()));
            vehicle.setType(type);
        }

        // Cập nhật chủ xe nếu customerId được gửi
        if (request.getCustomerId() != null) {
            Customer customer = customerRepo.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + request.getCustomerId()));
            vehicle.setCustomer(customer);
        }

        Vehicle updated = repository.save(vehicle);
        return toResponse(updated);
    }


    @Override
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy xe để xóa: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<VehicleResponse> getAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleResponse getById(Integer id) {
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe với ID: " + id));
        return toResponse(vehicle);
    }

    @Override
    public VehicleResponse getByPlate(String plate) {
        Vehicle vehicle = repository.findByPlateNumber(plate);
        if (vehicle == null) throw new RuntimeException("Không tìm thấy xe với biển số: " + plate);
        return toResponse(vehicle);
    }
}
