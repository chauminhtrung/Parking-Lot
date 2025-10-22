package com.example.server.Controller;


import com.example.server.DTO.SummaryStats;
import com.example.server.Services.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @GetMapping("/api/summary")
    public ResponseEntity<SummaryStats> getSummary() {
        SummaryStats stats = summaryService.getSummaryStats();
        return ResponseEntity.ok(stats);
    }
}
