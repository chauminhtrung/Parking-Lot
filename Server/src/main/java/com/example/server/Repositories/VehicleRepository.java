package com.example.server.Repositories;


import com.example.server.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    Vehicle findByPlateNumber(String plateNumber);
    List<Vehicle> findByCustomer_CustomerId(Integer customerId);
}

