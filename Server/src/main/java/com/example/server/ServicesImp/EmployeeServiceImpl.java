package com.example.server.ServicesImp;

import com.example.server.DTO.Request.EmployeeRequest;
import com.example.server.DTO.Respone.EmployeeResponse;
import com.example.server.Model.Employee;
import com.example.server.Repositories.EmployeeRepository;
import com.example.server.Services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repository;

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        Employee emp = new Employee();
        emp.setFullName(request.getFullName());
        emp.setPosition(request.getPosition());

        Employee saved = repository.save(emp);

        EmployeeResponse response = new EmployeeResponse();
        response.setEmployeeId(saved.getEmployeeId());
        response.setFullName(saved.getFullName());
        response.setPosition(saved.getPosition());

        return response;
    }

    @Override
    public EmployeeResponse update(Integer id, EmployeeRequest request) {
        Employee emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        emp.setFullName(request.getFullName());
        emp.setPosition(request.getPosition());

        Employee saved = repository.save(emp);

        EmployeeResponse response = new EmployeeResponse();
        response.setEmployeeId(saved.getEmployeeId());
        response.setFullName(saved.getFullName());
        response.setPosition(saved.getPosition());

        return response;
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public List<EmployeeResponse> getAll() {
        return repository.findAll().stream().map(emp -> {
            EmployeeResponse response = new EmployeeResponse();
            response.setEmployeeId(emp.getEmployeeId());
            response.setFullName(emp.getFullName());
            response.setPosition(emp.getPosition());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public EmployeeResponse getById(Integer id) {
        Employee emp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        EmployeeResponse response = new EmployeeResponse();
        response.setEmployeeId(emp.getEmployeeId());
        response.setFullName(emp.getFullName());
        response.setPosition(emp.getPosition());

        return response;
    }
}
