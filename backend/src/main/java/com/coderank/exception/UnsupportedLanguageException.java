package com.coderank.exception;

public class UnsupportedLanguageException extends RuntimeException {
    public UnsupportedLanguageException(String language) {
        super("Language not supported: " + language + ". Supported: java, python, javascript");
    }
}
