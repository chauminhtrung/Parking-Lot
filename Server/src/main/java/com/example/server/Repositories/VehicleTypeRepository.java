package com.example.server.Repositories;

import com.example.server.Model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Integer> {
    VehicleType findByTypeName(String typeName);
}
