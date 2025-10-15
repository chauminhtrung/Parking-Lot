package com.example.server.Repositories;


import com.example.server.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByPhone(String phone);
}

