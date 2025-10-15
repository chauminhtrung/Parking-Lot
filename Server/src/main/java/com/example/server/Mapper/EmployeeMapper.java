package com.example.server.Mapper;


import com.example.server.DTO.Request.EmployeeRequest;
import com.example.server.DTO.Respone.EmployeeResponse;
import com.example.server.Model.Employee;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    Employee toEntity(EmployeeRequest request);
    EmployeeResponse toResponse(Employee entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(EmployeeRequest dto, @MappingTarget Employee entity);
}

