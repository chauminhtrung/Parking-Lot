package com.example.server.Controller;

import com.example.server.DTO.SummaryStats;
import com.example.server.Services.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "*")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    // Truy vấn theo accountId
    @GetMapping
    public ResponseEntity<SummaryStats> getSummary(@RequestParam int accountId) {
        SummaryStats stats = summaryService.getSummaryStats(accountId);
        return ResponseEntity.ok(stats);
    }
}
