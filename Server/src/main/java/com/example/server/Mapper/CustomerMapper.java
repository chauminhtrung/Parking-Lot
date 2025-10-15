package com.example.server.Mapper;


import com.example.server.DTO.Request.CustomerRequest;
import com.example.server.DTO.Respone.CustomerResponse;
import com.example.server.Model.Customer;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toEntity(CustomerRequest request);
    CustomerResponse toResponse(Customer entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(CustomerRequest dto, @MappingTarget Customer entity);
}

