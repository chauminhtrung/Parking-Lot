package com.example.server.Services;


import com.example.server.DTO.Request.TicketRequest;
import com.example.server.DTO.Respone.TicketResponse;

import java.util.List;

public interface TicketService {
    TicketResponse checkIn(TicketRequest request);
    TicketResponse checkOut(Integer ticketId);
    List<TicketResponse> getAll();
    TicketResponse getById(Integer id);

    TicketResponse getBySpotId(Integer spotId);

}

