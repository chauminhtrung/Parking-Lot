package com.example.server.Controller;



import com.example.server.DTO.Request.TicketRequest;
import com.example.server.DTO.Respone.TicketResponse;
import com.example.server.Services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService service;

    @PostMapping("/checkin")
    public TicketResponse checkIn(@RequestBody TicketRequest request) {
        return service.checkIn(request);
    }

    @PostMapping("/checkout/{ticketId}")
    public TicketResponse checkOut(@PathVariable Integer ticketId) {
        return service.checkOut(ticketId);
    }

    @GetMapping
    public List<TicketResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TicketResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // 🔍 GET /api/tickets/active/{spotId}
    @GetMapping("/active/{spotId}")
    public TicketResponse getActiveTicketBySpot(@PathVariable Integer spotId) {
        return service.getBySpotId(spotId);
    }


}

