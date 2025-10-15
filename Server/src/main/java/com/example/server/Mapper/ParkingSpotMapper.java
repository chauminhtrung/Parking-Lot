package com.example.server.Mapper;


import com.example.server.DTO.Request.ParkingSpotRequest;
import com.example.server.DTO.Respone.ParkingSpotResponse;
import com.example.server.Model.ParkingSpot;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ParkingSpotMapper {
    ParkingSpot toEntity(ParkingSpotRequest request);
    ParkingSpotResponse toResponse(ParkingSpot entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ParkingSpotRequest dto, @MappingTarget ParkingSpot entity);
}

