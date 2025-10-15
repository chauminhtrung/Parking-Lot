package com.example.server.ServicesImp;

import com.example.server.DTO.Request.InvoiceRequest;
import com.example.server.DTO.Respone.InvoiceResponse;
import com.example.server.Mapper.InvoiceMapper;
import com.example.server.Model.Invoice;
import com.example.server.Model.Ticket;
import com.example.server.Repositories.InvoiceRepository;
import com.example.server.Repositories.TicketRepository;
import com.example.server.Services.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {


    private final InvoiceRepository invoiceRepository;
    private final TicketRepository ticketRepository;
    private final InvoiceMapper invoiceMapper;

    @Override
    public InvoiceResponse create(InvoiceRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé có ID: " + request.getTicketId()));

        Invoice invoice = new Invoice();
        invoice.setTicket(ticket);
        invoice.setIssueDate(LocalDateTime.now());
        invoice.setTotalAmount(request.getTotalAmount());

        return invoiceMapper.toResponse(invoiceRepository.save(invoice));
    }

    @Override
    public List<InvoiceResponse> getAll() {
        return invoiceRepository.findAll()
                .stream()
                .map(invoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponse getById(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn ID: " + id));
        return invoiceMapper.toResponse(invoice);
    }

    @Override
    public void delete(Integer id) {
        if (!invoiceRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy hóa đơn ID: " + id);
        }
        invoiceRepository.deleteById(id);
    }

    @Override
    public InvoiceResponse generateInvoice(Integer ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));

        if (ticket.getFee() == null) {
            throw new RuntimeException("Xe chưa được checkout, chưa có phí để tạo hóa đơn");
        }

        Invoice invoice = new Invoice();
        invoice.setTicket(ticket);
        invoice.setIssueDate(LocalDateTime.now());
        invoice.setTotalAmount(ticket.getFee());

        return invoiceMapper.toResponse(invoiceRepository.save(invoice));
    }
}
