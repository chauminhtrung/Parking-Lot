package com.example.server.Repositories;



import com.example.server.Model.Account;
import com.example.server.Model.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, Integer> {

    @Query("SELECT p FROM ParkingLot p WHERE p.account.accountId = :accountId")
    java.util.List<ParkingLot> findByAccount_AccountId(Integer accountId);

    @Query("SELECT COUNT(pl) FROM ParkingLot pl")
    long countLots();
}

