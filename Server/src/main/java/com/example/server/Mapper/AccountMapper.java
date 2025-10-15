package com.example.server.Mapper;


import com.example.server.DTO.Request.AccountRequest;
import com.example.server.DTO.Respone.AccountResponse;
import com.example.server.Model.Account;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    Account toEntity(AccountRequest request);

    AccountResponse toResponse(Account entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AccountRequest dto, @MappingTarget Account entity);
}
