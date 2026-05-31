package com.coderank.executor;

import com.coderank.dto.Dtos.CodeRequest;
import com.coderank.dto.ExecutionResult;
import com.coderank.enums.ExecutionStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public abstract class AbstractDockerExecutor implements CodeExecutor {

    protected static final Logger logger =
            LoggerFactory.getLogger(AbstractDockerExecutor.class);

    @Value("${app.execution.timeout:5}")
    protected long timeout;

    @Value("${app.execution.temp-dir:/tmp/coderank}")
    protected String tempDir;

    protected abstract String getDockerImage();

    protected abstract String getFileName();

    protected abstract List<String> buildDockerCommand(Path tempPath, String input);

    @Override
    public ExecutionResult execute(CodeRequest request) {

        Path execDir = null;
        long startTime = System.currentTimeMillis();

        try {
            // 1. Create temp directory
            execDir = createTempDirectory();
            logger.info("Created execution dir: {}", execDir);

            // 2. Write code file
            writeSourceFile(execDir, request.getCode());

            logger.info("Starting {} execution", getDockerImage());

            // 3. Build docker command
            List<String> command =
                    buildDockerCommand(execDir, request.getInput());

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(false);

            // 4. Start process
            Process process = pb.start();

            logger.info("INPUT FROM REQUEST: '{}'", request.getInput());

            // ======================================================
            // 🔥 CRITICAL FIX: SEND INPUT TO DOCKER PROPERLY
            // ======================================================
            try (OutputStream os = process.getOutputStream()) {

                if (request.getInput() != null &&
                        !request.getInput().isBlank()) {

                    os.write(request.getInput().getBytes());
                    os.flush();
                }
                // closing is IMPORTANT → sends EOF
            }

            // 5. Wait for execution
            boolean finished =
                    process.waitFor(timeout, TimeUnit.SECONDS);

            long elapsed = System.currentTimeMillis() - startTime;
            String execTime = String.format("%.2fs", elapsed / 1000.0);

            // 6. Timeout handling
            if (!finished) {
                process.destroyForcibly();

                logger.warn("Execution timed out after {}s", timeout);

                return ExecutionResult.builder()
                        .status(ExecutionStatus.TIMEOUT)
                        .output("")
                        .error("Execution timed out after " + timeout + " seconds")
                        .executionTime(execTime)
                        .build();
            }

            // 7. Read output
            String stdout =
                    new String(process.getInputStream().readAllBytes()).trim();

            String stderr =
                    new String(process.getErrorStream().readAllBytes()).trim();

            int exitCode = process.exitValue();

            logger.info("Execution finished. Exit code: {}", exitCode);

            if (exitCode != 0) {
                ExecutionStatus status =
                        stderr.toLowerCase().contains("error")
                                ? ExecutionStatus.COMPILATION_ERROR
                                : ExecutionStatus.RUNTIME_ERROR;

                return ExecutionResult.builder()
                        .status(status)
                        .output(stdout)
                        .error(stderr)
                        .executionTime(execTime)
                        .build();
            }

            return ExecutionResult.builder()
                    .status(ExecutionStatus.SUCCESS)
                    .output(stdout)
                    .error(stderr)
                    .executionTime(execTime)
                    .build();

        } catch (IOException | InterruptedException e) {

            logger.error("Docker execution error", e);

            return ExecutionResult.builder()
                    .status(ExecutionStatus.SYSTEM_ERROR)
                    .output("")
                    .error("System error: " + e.getMessage())
                    .executionTime("0s")
                    .build();

        } finally {

            if (execDir != null) {
                deleteTempDirectory(execDir);
                logger.info("Temp dir destroyed");
            }
        }
    }

    protected Path createTempDirectory() throws IOException {
        File base = new File(tempDir);
        if (!base.exists()) base.mkdirs();

        return Files.createTempDirectory(
                base.toPath(),
                "exec-" + UUID.randomUUID().toString().substring(0, 8)
        );
    }

    protected void writeSourceFile(Path dir, String code) throws IOException {
        File file = dir.resolve(getFileName()).toFile();
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(code);
        }
    }

    protected void deleteTempDirectory(Path path) {
        try {
            Files.walk(path)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException e) {
            logger.warn("Failed to clean temp directory: {}", path);
        }
    }
}