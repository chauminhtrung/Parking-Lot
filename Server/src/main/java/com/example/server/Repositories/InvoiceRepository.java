package com.example.server.Repositories;


import com.example.server.Model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("SELECT i FROM Invoice i WHERE MONTH(i.issueDate) = :month AND YEAR(i.issueDate) = :year")
    List<Invoice> findByMonthAndYear(int month, int year);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE MONTH(i.issueDate) = :month AND YEAR(i.issueDate) = :year")
    Double getTotalRevenueByMonth(int month, int year);
}

