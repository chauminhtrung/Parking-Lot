package com.example.server.Mapper;

import com.example.server.DTO.Request.ParkingLotRequest;
import com.example.server.DTO.Respone.ParkingLotResponse;
import com.example.server.Model.ParkingLot;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ParkingLotMapper {

    ParkingLot toEntity(ParkingLotRequest request);
    ParkingLotResponse toResponse(ParkingLot entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ParkingLotRequest dto, @MappingTarget ParkingLot entity);
}


