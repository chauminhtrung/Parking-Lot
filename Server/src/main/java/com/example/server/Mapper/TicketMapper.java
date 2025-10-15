package com.example.server.Mapper;


import com.example.server.DTO.Request.TicketRequest;
import com.example.server.DTO.Respone.TicketResponse;
import com.example.server.Model.Ticket;
import org.mapstruct.*;



@Mapper(componentModel = "spring", uses = { VehicleMapper.class, ParkingSpotMapper.class, EmployeeMapper.class })
public interface TicketMapper {


    Ticket toEntity(TicketRequest request);
    TicketResponse toResponse(Ticket entity);

    // Cập nhật Entity từ DTO, bỏ qua các quan hệ
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TicketRequest dto, @MappingTarget Ticket entity);
}





