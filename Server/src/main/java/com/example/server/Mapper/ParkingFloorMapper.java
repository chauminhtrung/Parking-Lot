package com.example.server.Mapper;


import com.example.server.DTO.Request.ParkingFloorRequest;
import com.example.server.DTO.Respone.ParkingFloorResponse;
import com.example.server.Model.ParkingFloor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ParkingFloorMapper {
    ParkingFloor toEntity(ParkingFloorRequest request);
    ParkingFloorResponse toResponse(ParkingFloor entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ParkingFloorRequest dto, @MappingTarget ParkingFloor entity);
}

