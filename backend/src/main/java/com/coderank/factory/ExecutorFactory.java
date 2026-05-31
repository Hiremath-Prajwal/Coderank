package com.coderank.factory;

import com.coderank.enums.Language;
import com.coderank.exception.UnsupportedLanguageException;
import com.coderank.executor.CodeExecutor;
import com.coderank.executor.JavaExecutor;
import com.coderank.executor.JavaScriptExecutor;
import com.coderank.executor.PythonExecutor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Factory Pattern — maps Language enum to its executor bean.
 * To add a new language: create the executor + add one line here.
 */
@Component
public class ExecutorFactory {

    private final Map<Language, CodeExecutor> registry;

    public ExecutorFactory(JavaExecutor javaExecutor,
                           PythonExecutor pythonExecutor,
                           JavaScriptExecutor javaScriptExecutor) {
        registry = new HashMap<>();
        registry.put(Language.JAVA,       javaExecutor);
        registry.put(Language.PYTHON,     pythonExecutor);
        registry.put(Language.JAVASCRIPT, javaScriptExecutor);
    }

    public CodeExecutor getExecutor(String languageStr) {
        try {
            Language language = Language.valueOf(languageStr.toUpperCase());
            CodeExecutor executor = registry.get(language);
            if (executor == null) {
                throw new UnsupportedLanguageException(languageStr);
            }
            return executor;
        } catch (IllegalArgumentException e) {
            throw new UnsupportedLanguageException(languageStr);
        }
    }
}
