package com.coderank.exception;

public class DockerExecutionException extends RuntimeException {

    public DockerExecutionException(String message, Throwable cause) {
        super(message, cause);
    }

    public DockerExecutionException(String message) {
        super(message);
    }
}
