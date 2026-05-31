package com.coderank.exception;

public class CodeExecutionTimeoutException extends RuntimeException {
    public CodeExecutionTimeoutException(long timeoutSeconds) {
        super("Code execution timed out after " + timeoutSeconds + " seconds");
    }
}
