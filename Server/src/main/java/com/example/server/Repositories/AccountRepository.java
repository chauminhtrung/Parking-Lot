package com.example.server.Repositories;



import com.example.server.Model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    Account findByUsername(String username);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.role = 'manager'")
    long countManagers();

    @Query("SELECT a FROM Account a WHERE a.role = :role")
    java.util.List<Account> findByRole(String role);

}

