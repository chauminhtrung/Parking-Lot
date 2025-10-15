package com.example.server.Mapper;


import com.example.server.DTO.Request.ParkingAreaRequest;
import com.example.server.DTO.Respone.ParkingAreaResponse;
import com.example.server.Model.ParkingArea;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ParkingAreaMapper {
    ParkingArea toEntity(ParkingAreaRequest request);
    ParkingAreaResponse toResponse(ParkingArea entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ParkingAreaRequest dto, @MappingTarget ParkingArea entity);
}

