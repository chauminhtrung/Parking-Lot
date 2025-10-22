package com.example.server.ServicesImp;

import com.example.server.DTO.Request.TicketRequest;
import com.example.server.DTO.Respone.TicketResponse;
import com.example.server.Model.Employee;
import com.example.server.Model.ParkingSpot;
import com.example.server.Model.Ticket;
import com.example.server.Model.Vehicle;
import com.example.server.Repositories.EmployeeRepository;
import com.example.server.Repositories.ParkingSpotRepository;
import com.example.server.Repositories.TicketRepository;
import com.example.server.Repositories.VehicleRepository;
import com.example.server.Services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSpotRepository spotRepository;
    private final EmployeeRepository employeeRepository;

    // ---------------------
    // Helpers chuyển đổi
    // ---------------------
    private TicketResponse toResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setTicketId(ticket.getTicketId());
        response.setPlateNumber(ticket.getVehicle() != null ? ticket.getVehicle().getPlateNumber() : null);
        response.setPlateNumber(ticket.getVehicle() != null ? ticket.getVehicle().getPlateNumber() : "Unknown");
        response.setSpotCode(ticket.getSpot() != null ? ticket.getSpot().getSpotCode() : null);
        response.setEmployeeName(ticket.getEmployee() != null ? ticket.getEmployee().getFullName() : null);
        response.setEmployeeName(ticket.getEmployee() != null ? ticket.getEmployee().getFullName() : "Unknown");
        response.setCheckInTime(ticket.getCheckInTime().toString());
        response.setCheckOutTime(
                ticket.getCheckOutTime() != null
                        ? ticket.getCheckOutTime().toString()
                        : ""
        );

        response.setFee(ticket.getFee() != null ?  ticket.getFee() : 0 );
        return response;
    }

    // ---------------------
    // CRUD / Business
    // ---------------------
    @Override
    public TicketResponse checkIn(TicketRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));
        ParkingSpot spot = spotRepository.findById(request.getSpotId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chỗ đỗ"));
        Employee emp = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        if (!"Empty".equals(spot.getStatus())) {
            throw new RuntimeException("Chỗ đỗ đã có xe!");
        }

        spot.setStatus("Occupied");
        spotRepository.save(spot);

        Ticket ticket = new Ticket();
        ticket.setVehicle(vehicle);
        ticket.setSpot(spot);
        ticket.setEmployee(emp);
        ticket.setCheckInTime(LocalDateTime.now());

        return toResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse checkOut(Integer ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));

        if (ticket.getCheckOutTime() != null) {
            throw new RuntimeException("Xe đã được trả!");
        }

        ticket.setCheckOutTime(LocalDateTime.now());
        long hours = Math.max(1, Duration.between(ticket.getCheckInTime(), ticket.getCheckOutTime()).toHours());
        double fee = hours * ticket.getVehicle().getType().getPricePerHour().doubleValue();
        ticket.setFee(fee);


        return toResponse(ticketRepository.save(ticket));
    }

    @Override
    public List<TicketResponse> getAll() {
        return ticketRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse getById(Integer id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));
        return toResponse(ticket);
    }

    @Override
    public TicketResponse getBySpotId(Integer spotId) {
        Ticket ticket = ticketRepository.findFirstBySpot_SpotIdAndCheckOutTimeIsNull(spotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé đang hoạt động cho chỗ đỗ này"));
        return toResponse(ticket);
    }



}
