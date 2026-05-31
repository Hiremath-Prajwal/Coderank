package com.coderank.executor;

import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

@Component
public class PythonExecutor extends AbstractDockerExecutor {

    @Override
    protected String getDockerImage() {
        return "python:3.11-alpine";
    }
    
    @Override
    protected String getFileName() {
        return "solution.py";
    }

    @Override
    protected List<String> buildDockerCommand(Path tempPath, String input) {
        return Arrays.asList(
                "docker", "run",
                "-i",
                "--rm",
                "--memory=256m",
                "--cpus=0.5",
                "--network=none",
                "--name", "coderank-" + tempPath.getFileName(),
                "-v", tempPath.toAbsolutePath() + ":/code",
                "-w", "/code",
                getDockerImage(),
                "python", "solution.py"
        );
    }
}
