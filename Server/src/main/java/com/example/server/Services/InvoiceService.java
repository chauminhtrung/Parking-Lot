package com.example.server.Services;


import com.example.server.DTO.Request.InvoiceRequest;
import com.example.server.DTO.Respone.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse create(InvoiceRequest request);
    List<InvoiceResponse> getAll();
    InvoiceResponse getById(Integer id);
    void delete(Integer id);
    InvoiceResponse generateInvoice(Integer ticketId);
}

