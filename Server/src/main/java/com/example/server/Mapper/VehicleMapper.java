package com.example.server.Mapper;

import com.example.server.DTO.Request.VehicleRequest;
import com.example.server.DTO.Respone.VehicleResponse;
import com.example.server.Model.Vehicle;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface VehicleMapper {


    Vehicle toEntity(VehicleRequest request);
    VehicleResponse toResponse(Vehicle vehicle);

    // Cập nhật entity từ DTO, bỏ qua type & customer
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(VehicleRequest dto, @MappingTarget Vehicle entity);
}
