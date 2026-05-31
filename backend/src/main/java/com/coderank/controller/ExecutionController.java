package com.coderank.controller;

import com.coderank.dto.Dtos.CodeRequest;
import com.coderank.dto.Dtos.ExecutionHistoryResponse;
import com.coderank.dto.Dtos.ExecutionResponse;
import com.coderank.service.ExecutionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExecutionController {

    private final ExecutionService executionService;

    public ExecutionController(ExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping("/execute")
    public ResponseEntity<ExecutionResponse> execute(
            @Valid @RequestBody CodeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ExecutionResponse response =
                executionService.execute(request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/executions/history")
    public ResponseEntity<List<ExecutionHistoryResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ExecutionHistoryResponse> history =
                executionService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }
}
