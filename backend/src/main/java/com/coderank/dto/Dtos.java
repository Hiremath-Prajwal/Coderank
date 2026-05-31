package com.coderank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class Dtos {

    // =============================================
    // AUTH DTOs
    // =============================================

    public static class RegisterRequest {

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3-50 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public RegisterRequest() {}

        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }

        public void setUsername(String username) { this.username = username; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {

        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public String getPassword() { return password; }

        public void setUsername(String username) { this.username = username; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {

        private String token;
        private String username;
        private String email;
        private String message;

        public AuthResponse() {}

        public AuthResponse(String token, String username, String email) {
            this.token = token;
            this.username = username;
            this.email = email;
            this.message = "Authentication successful";
        }

        public String getToken() { return token; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getMessage() { return message; }

        public void setToken(String token) { this.token = token; }
        public void setUsername(String username) { this.username = username; }
        public void setEmail(String email) { this.email = email; }
        public void setMessage(String message) { this.message = message; }
    }

    // =============================================
    // CODE EXECUTION DTOs
    // =============================================

    public static class CodeRequest {

        @NotBlank(message = "Language is required")
        private String language;

        @NotBlank(message = "Code is required")
        private String code;

        private String input = "";

        public CodeRequest() {}

        public String getLanguage() { return language; }
        public String getCode() { return code; }
        public String getInput() { return input; }

        public void setLanguage(String language) { this.language = language; }
        public void setCode(String code) { this.code = code; }
        public void setInput(String input) { this.input = input; }
    }

    public static class ExecutionResponse {

        private String status;
        private String output;
        private String error;
        private String executionTime;

        public ExecutionResponse() {}

        public static ExecutionResponse success(String output, String executionTime) {
            ExecutionResponse r = new ExecutionResponse();
            r.status = "SUCCESS";
            r.output = output;
            r.error = "";
            r.executionTime = executionTime;
            return r;
        }

        public static ExecutionResponse failure(String status, String error, String executionTime) {
            ExecutionResponse r = new ExecutionResponse();
            r.status = status;
            r.output = "";
            r.error = error;
            r.executionTime = executionTime;
            return r;
        }

        public String getStatus() { return status; }
        public String getOutput() { return output; }
        public String getError() { return error; }
        public String getExecutionTime() { return executionTime; }

        public void setStatus(String status) { this.status = status; }
        public void setOutput(String output) { this.output = output; }
        public void setError(String error) { this.error = error; }
        public void setExecutionTime(String executionTime) { this.executionTime = executionTime; }
    }

    // =============================================
    // HISTORY DTO
    // =============================================

    public static class ExecutionHistoryResponse {

        private Long id;
        private String language;
        private String status;
        private String output;
        private String error;
        private String sourceCode;
        private String executionTime;
        private String createdAt;

        public ExecutionHistoryResponse() {}

        public Long getId() { return id; }
        public String getLanguage() { return language; }
        public String getStatus() { return status; }
        public String getOutput() { return output; }
        public String getError() { return error; }
        public String getSourceCode() { return sourceCode; }
        public String getExecutionTime() { return executionTime; }
        public String getCreatedAt() { return createdAt; }

        public void setId(Long id) { this.id = id; }
        public void setLanguage(String language) { this.language = language; }
        public void setStatus(String status) { this.status = status; }
        public void setOutput(String output) { this.output = output; }
        public void setError(String error) { this.error = error; }
        public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
        public void setExecutionTime(String executionTime) { this.executionTime = executionTime; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    // =============================================
    // ERROR DTO
    // =============================================

    public static class ApiError {

        private int status;
        private String error;
        private String message;
        private String timestamp;

        public ApiError() {}

        public ApiError(int status, String error, String message) {
            this.status = status;
            this.error = error;
            this.message = message;
            this.timestamp = LocalDateTime.now().toString();
        }

        public int getStatus() { return status; }
        public String getError() { return error; }
        public String getMessage() { return message; }
        public String getTimestamp() { return timestamp; }

        public void setStatus(int status) { this.status = status; }
        public void setError(String error) { this.error = error; }
        public void setMessage(String message) { this.message = message; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }
}
