package com.example.server.Mapper;


import com.example.server.DTO.Request.InvoiceRequest;
import com.example.server.DTO.Respone.InvoiceResponse;
import com.example.server.Model.Invoice;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = { TicketMapper.class })
public interface InvoiceMapper {
    Invoice toEntity(InvoiceRequest request);
    InvoiceResponse toResponse(Invoice entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(InvoiceRequest dto, @MappingTarget Invoice entity);
}

