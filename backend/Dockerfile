
# CodeRank Backend - Dockerfile
# =============================================================
#
# This file tells Docker how to build and run the Spring Boot app.
#
# We use a TWO-STAGE build:
#   Stage 1 (builder) - compiles the Java code into a JAR file
#   Stage 2 (runtime) - runs only the JAR (no Maven, no source code)
#
# Why two stages?
#   - The final image is much smaller (~200MB vs ~700MB)
#   - Source code and Maven are NOT included in the final image
#   - Better security and faster deployment
#
# =============================================================

# ─────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# Uses Maven + JDK 21 to compile and package the application
# ─────────────────────────────────────────────────────────────

FROM maven:3.9.5-eclipse-temurin-21 AS builder

# Set working directory inside the container
WORKDIR /app

# STEP 1: Copy pom.xml first (before source code)
# Reason: Docker caches each layer. If pom.xml hasn't changed,
# Docker reuses the cached dependency download — saves time.
COPY pom.xml .

# STEP 2: Download all Maven dependencies
# -B flag = batch mode (no interactive prompts)
RUN mvn dependency:go-offline -B

# STEP 3: Copy the actual source code
COPY src ./src

# STEP 4: Build the JAR file
# -DskipTests = skip unit tests during build (faster)
# Output: target/coderank-backend-1.0.0.jar
RUN mvn package -DskipTests


# ─────────────────────────────────────────────────────────────
# STAGE 2 — RUNTIME
# Uses only JRE (Java Runtime) — no Maven, no source code
# eclipse-temurin:21-jre-alpine is a small Alpine Linux image
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# STEP 5: Create a non-root user for security
# Running as root inside containers is a security risk
# We create a dedicated 'coderank' user instead
RUN addgroup -S coderank && adduser -S coderank -G coderank

# STEP 6: Copy ONLY the JAR from Stage 1
# *.jar matches whatever version number is in the filename
COPY --from=builder /app/target/*.jar app.jar

# STEP 7: Create the logs directory and give ownership to our user
RUN mkdir -p /app/logs && chown coderank:coderank /app/logs

# STEP 8: Switch to non-root user
USER coderank

# STEP 9: Tell Docker this app listens on port 8080
# (This is documentation only — the actual port binding
#  happens in docker-compose.yml or docker run command)
EXPOSE 8080

# STEP 10: Command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
