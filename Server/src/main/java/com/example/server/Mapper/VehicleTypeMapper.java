package com.example.server.Mapper;


import com.example.server.DTO.Request.VehicleTypeRequest;
import com.example.server.DTO.Respone.VehicleTypeResponse;
import com.example.server.Model.VehicleType;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface VehicleTypeMapper {
    VehicleType toEntity(VehicleTypeRequest request);
    VehicleTypeResponse toResponse(VehicleType entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(VehicleTypeRequest dto, @MappingTarget VehicleType entity);
}

