package com.coderank.model;

import com.coderank.enums.ExecutionStatus;
import com.coderank.enums.Language;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "executions")
public class Execution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Language language;

    @Column(name = "source_code", nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Column(columnDefinition = "TEXT")
    private String output;

    @Column(columnDefinition = "TEXT")
    private String error;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private ExecutionStatus status;

    @Column(name = "execution_time", length = 20)
    private String executionTime;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Constructors ──────────────────────────────────────────

    public Execution() {}

    public Execution(Long id, User user, Language language, String sourceCode,
                     String output, String error, ExecutionStatus status,
                     String executionTime, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.language = language;
        this.sourceCode = sourceCode;
        this.output = output;
        this.error = error;
        this.status = status;
        this.executionTime = executionTime;
        this.createdAt = createdAt;
    }

    // ── Getters ───────────────────────────────────────────────

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Language getLanguage() { return language; }
    public String getSourceCode() { return sourceCode; }
    public String getOutput() { return output; }
    public String getError() { return error; }
    public ExecutionStatus getStatus() { return status; }
    public String getExecutionTime() { return executionTime; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setLanguage(Language language) { this.language = language; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
    public void setOutput(String output) { this.output = output; }
    public void setError(String error) { this.error = error; }
    public void setStatus(ExecutionStatus status) { this.status = status; }
    public void setExecutionTime(String executionTime) { this.executionTime = executionTime; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ── Builder ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private Language language;
        private String sourceCode;
        private String output;
        private String error;
        private ExecutionStatus status;
        private String executionTime;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder language(Language language) { this.language = language; return this; }
        public Builder sourceCode(String sourceCode) { this.sourceCode = sourceCode; return this; }
        public Builder output(String output) { this.output = output; return this; }
        public Builder error(String error) { this.error = error; return this; }
        public Builder status(ExecutionStatus status) { this.status = status; return this; }
        public Builder executionTime(String executionTime) { this.executionTime = executionTime; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Execution build() {
            Execution e = new Execution();
            e.id = this.id;
            e.user = this.user;
            e.language = this.language;
            e.sourceCode = this.sourceCode;
            e.output = this.output;
            e.error = this.error;
            e.status = this.status;
            e.executionTime = this.executionTime;
            e.createdAt = this.createdAt;
            return e;
        }
    }
}
