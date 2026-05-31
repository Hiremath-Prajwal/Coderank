package com.coderank.executor;

import com.coderank.dto.Dtos.CodeRequest;
import com.coderank.dto.ExecutionResult;

/**
 * Strategy interface — each language implements this.
 * Adding a new language = implement this + register in ExecutorFactory.
 */
public interface CodeExecutor {
    ExecutionResult execute(CodeRequest request);
}
