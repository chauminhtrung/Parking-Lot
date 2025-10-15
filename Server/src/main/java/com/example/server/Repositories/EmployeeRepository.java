package com.example.server.Repositories;


import com.example.server.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Employee findByFullName(String fullName);
}

