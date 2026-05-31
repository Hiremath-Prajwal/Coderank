package com.coderank.service;

import com.coderank.dto.Dtos.CodeRequest;
import com.coderank.dto.Dtos.ExecutionHistoryResponse;
import com.coderank.dto.Dtos.ExecutionResponse;
import com.coderank.dto.ExecutionResult;
import com.coderank.enums.Language;
import com.coderank.executor.CodeExecutor;
import com.coderank.factory.ExecutorFactory;
import com.coderank.model.Execution;
import com.coderank.model.User;
import com.coderank.repository.ExecutionRepository;
import com.coderank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExecutionService {

    private static final Logger logger = LoggerFactory.getLogger(ExecutionService.class);

    private final ExecutorFactory executorFactory;
    private final ExecutionRepository executionRepository;
    private final UserRepository userRepository;

    public ExecutionService(ExecutorFactory executorFactory,
                            ExecutionRepository executionRepository,
                            UserRepository userRepository) {
        this.executorFactory     = executorFactory;
        this.executionRepository = executionRepository;
        this.userRepository      = userRepository;
    }

    public ExecutionResponse execute(CodeRequest request, String username) {
        logger.info("Executing {} code for user: {}", request.getLanguage(), username);

        // Resolve the correct executor
        CodeExecutor executor = executorFactory.getExecutor(request.getLanguage());

        // Run inside Docker container
        ExecutionResult result = executor.execute(request);

        // Persist result
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Execution execution = Execution.builder()
                .user(user)
                .language(Language.valueOf(request.getLanguage().toUpperCase()))
                .sourceCode(request.getCode())
                .output(result.getOutput())
                .error(result.getError())
                .status(result.getStatus())
                .executionTime(result.getExecutionTime())
                .build();

        executionRepository.save(execution);
        logger.info("Execution saved. Status: {}, Time: {}",
                result.getStatus(), result.getExecutionTime());

        if (result.isSuccess()) {
            return ExecutionResponse.success(result.getOutput(), result.getExecutionTime());
        }
        return ExecutionResponse.failure(
                result.getStatus().name(), result.getError(), result.getExecutionTime());
    }

    public List<ExecutionHistoryResponse> getHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Execution> executions =
                executionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        List<ExecutionHistoryResponse> history = new ArrayList<>();
        for (Execution execution : executions) {
            history.add(mapToHistoryResponse(execution));
        }
        return history;
    }

    private ExecutionHistoryResponse mapToHistoryResponse(Execution execution) {
        ExecutionHistoryResponse resp = new ExecutionHistoryResponse();
        resp.setId(execution.getId());
        resp.setLanguage(execution.getLanguage().name().toLowerCase());
        resp.setStatus(execution.getStatus().name());
        resp.setOutput(execution.getOutput());
        resp.setError(execution.getError());
        resp.setSourceCode(execution.getSourceCode());
        resp.setExecutionTime(execution.getExecutionTime());
        resp.setCreatedAt(execution.getCreatedAt() != null
                ? execution.getCreatedAt().toString() : "");
        return resp;
    }
}
