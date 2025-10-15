package com.example.server.ServicesImp;

import com.example.server.DTO.Request.CustomerRequest;
import com.example.server.DTO.Respone.CustomerResponse;
import com.example.server.Model.Customer;
import com.example.server.Repositories.CustomerRepository;
import com.example.server.Services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    // ---------------------
    // Helpers chuyển đổi
    // ---------------------
    private Customer toEntity(CustomerRequest req) {
        Customer c = new Customer();
        c.setFullName(req.getFullName() != null ? req.getFullName() : "");
        c.setPhone(req.getPhone() != null ? req.getPhone() : "");
        c.setAddress(req.getAddress() != null ? req.getAddress() : "");
        return c;
    }

    private CustomerResponse toResponse(Customer entity) {
        CustomerResponse r = new CustomerResponse();
        r.setCustomerId(entity.getCustomerId());
        r.setFullName(entity.getFullName());
        r.setPhone(entity.getPhone());
        r.setAddress(entity.getAddress());
        return r;
    }

    // ---------------------
    // CRUD
    // ---------------------
    @Override
    public CustomerResponse create(CustomerRequest request) {
        Customer customer = toEntity(request);
        Customer saved = repository.save(customer);
        return toResponse(saved);
    }

    @Override
    public CustomerResponse update(Integer id, CustomerRequest request) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));

        // Cập nhật từng trường nếu có dữ liệu
        if (request.getFullName() != null) customer.setFullName(request.getFullName());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());

        Customer updated = repository.save(customer);
        return toResponse(updated);
    }

    @Override
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy khách hàng để xóa: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<CustomerResponse> getAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getById(Integer id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
        return toResponse(customer);
    }
}
