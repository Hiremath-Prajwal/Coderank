package com.coderank.dto;

import com.coderank.enums.ExecutionStatus;

public class ExecutionResult {

    private ExecutionStatus status;
    private String output;
    private String error;
    private String executionTime;

    // ── Constructors ──────────────────────────────────────────

    public ExecutionResult() {}

    public ExecutionResult(ExecutionStatus status, String output,
                           String error, String executionTime) {
        this.status = status;
        this.output = output;
        this.error = error;
        this.executionTime = executionTime;
    }

    // ── Getters ───────────────────────────────────────────────

    public ExecutionStatus getStatus() { return status; }
    public String getOutput() { return output; }
    public String getError() { return error; }
    public String getExecutionTime() { return executionTime; }

    // ── Setters ───────────────────────────────────────────────

    public void setStatus(ExecutionStatus status) { this.status = status; }
    public void setOutput(String output) { this.output = output; }
    public void setError(String error) { this.error = error; }
    public void setExecutionTime(String executionTime) { this.executionTime = executionTime; }

    public boolean isSuccess() {
        return status == ExecutionStatus.SUCCESS;
    }

    // ── Builder ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private ExecutionStatus status;
        private String output;
        private String error;
        private String executionTime;

        public Builder status(ExecutionStatus status) { this.status = status; return this; }
        public Builder output(String output) { this.output = output; return this; }
        public Builder error(String error) { this.error = error; return this; }
        public Builder executionTime(String executionTime) { this.executionTime = executionTime; return this; }

        public ExecutionResult build() {
            return new ExecutionResult(status, output, error, executionTime);
        }
    }
}
