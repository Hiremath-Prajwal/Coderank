# CodeRank — Online Code Execution Platform

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat&logo=openjdk)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=flat&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat&logo=jsonwebtokens)](https://jwt.io/)

> A full-stack online code execution platform where users can write, run, and store code in multiple programming languages — all executed securely inside isolated Docker containers.

---

## 📸 Screenshots

| Login Page | Dashboard — Code Editor | Execution History |
|---|---|---|
| ![Login](https://via.placeholder.com/280x180/1e1e2e/cdd6f4?text=Login+Page) | ![Dashboard](https://via.placeholder.com/280x180/1e1e2e/a6e3a1?text=Code+Editor) | ![History](https://via.placeholder.com/280x180/1e1e2e/89b4fa?text=History+Panel) |

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, stateless token-based auth
- 💻 **Monaco Code Editor** — VS Code quality editor with syntax highlighting
- 🐳 **Docker Execution** — Every submission runs in an isolated Docker container
- 🌐 **Multi-language Support** — Java, Python, JavaScript (easily extensible)
- 📋 **Execution History** — Browse all past runs, view code and output
- ⏱️ **Timeout Protection** — Programs are killed after 5 seconds
- 🛡️ **Resource Limits** — Memory capped at 256MB, CPU at 0.5 cores
- 🚫 **Network Isolation** — `--network=none` prevents outbound calls from user code
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend                        │
│   Login/Register → Monaco Editor → Output Console       │
│   Language Selector → Run Button → Execution History    │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP + JWT (Bearer Token)
                       ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot Backend                       │
│                                                         │
│  AuthController          ExecutionController            │
│       │                          │                      │
│  AuthService             ExecutionService               │
│       │                          │                      │
│  UserRepository        ExecutorFactory                  │
│   (MySQL)            ┌─────┬─────┴─────┐               │
│                  JavaExec PythonExec  JSExec            │
│                  └────────┴───────────┘                 │
│              AbstractDockerExecutor (shared logic)      │
└──────────────────────┬──────────────────────────────────┘
                       │  ProcessBuilder → Docker CLI
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Docker Containers (per execution)          │
│   openjdk:17    python:3.11    node:18                  │
│   --memory=256m  --cpus=0.5  --network=none  --rm       │
└──────────────────────┬──────────────────────────────────┘
                       │  Results saved
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  MySQL Database                         │
│     users table          executions table               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 3.2 | Application framework |
| Spring Security | Authentication & authorization |
| JWT (JJWT 0.11.5) | Stateless token authentication |
| Spring Data JPA | Database ORM |
| Hibernate | SQL generation |
| MySQL 8.0 | Relational database |
| Docker | Sandboxed code execution |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Monaco Editor | Code editor (VS Code engine) |
| Axios | HTTP client |
| React Router DOM v6 | Client-side routing |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |

---

## 📁 Project Structure

```
coderank/
│
├── coderank-backend/                   # Spring Boot backend
│   ├── src/main/java/com/coderank/
│   │   ├── CoderankApplication.java    # Main entry point
│   │   ├── controller/
│   │   │   ├── AuthController.java     # POST /auth/register, /auth/login
│   │   │   └── ExecutionController.java# POST /api/execute, GET /api/executions/history
│   │   ├── service/
│   │   │   ├── AuthService.java        # Registration, login, BCrypt, JWT
│   │   │   └── ExecutionService.java   # Orchestrates execution + persistence
│   │   ├── security/
│   │   │   ├── JwtAuthenticationFilter.java  # Validates Bearer token on every request
│   │   │   └── UserDetailsServiceImpl.java   # Loads user from DB for Spring Security
│   │   ├── executor/
│   │   │   ├── CodeExecutor.java       # Strategy interface
│   │   │   ├── AbstractDockerExecutor.java   # Shared Docker lifecycle (Template Method)
│   │   │   ├── JavaExecutor.java       # Runs openjdk:17 container
│   │   │   ├── PythonExecutor.java     # Runs python:3.11 container
│   │   │   └── JavaScriptExecutor.java # Runs node:18 container
│   │   ├── factory/
│   │   │   └── ExecutorFactory.java    # Maps language string → executor bean
│   │   ├── config/
│   │   │   └── SecurityConfig.java     # Spring Security + CORS + JWT filter
│   │   ├── model/
│   │   │   ├── User.java               # users table entity
│   │   │   └── Execution.java          # executions table entity
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── ExecutionRepository.java
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── CodeRequest.java
│   │   │   ├── CodeResponse.java
│   │   │   ├── ExecutionResult.java    # Internal (not sent to client)
│   │   │   ├── ExecutionHistoryResponse.java
│   │   │   └── ApiErrorResponse.java
│   │   ├── exception/
│   │   │   ├── UnsupportedLanguageException.java
│   │   │   ├── CodeExecutionTimeoutException.java
│   │   │   ├── DockerExecutionException.java
│   │   │   └── GlobalExceptionHandler.java  # @RestControllerAdvice
│   │   ├── util/
│   │   │   └── JwtUtil.java            # Generate + validate JWT tokens
│   │   └── enums/
│   │       ├── Language.java           # JAVA, PYTHON, JAVASCRIPT
│   │       └── ExecutionStatus.java    # SUCCESS, RUNTIME_ERROR, TIMEOUT...
│   ├── src/main/resources/
│   │   └── application.properties      # All configuration
│   ├── Dockerfile                      # Docker image for backend
│   └── pom.xml                         # Maven dependencies
│
├── coderank-frontend/                  # React frontend
│   ├── src/
│   │   ├── main.jsx                    # React entry point
│   │   ├── App.jsx                     # Route definitions
│   │   ├── index.css                   # Global styles
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state (token + user)
│   │   ├── services/
│   │   │   └── api.js                  # All Axios API calls
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx      # Redirects to login if not authenticated
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx       # Main editor page
│   │   └── components/
│   │       ├── common/Navbar.jsx
│   │       ├── editor/
│   │       │   ├── LanguageSelector.jsx
│   │       │   └── CodeEditor.jsx      # Monaco editor wrapper
│   │       ├── output/
│   │       │   └── OutputConsole.jsx   # stdout/stderr display
│   │       └── history/
│   │           └── ExecutionHistory.jsx
│   ├── Dockerfile                      # Docker image for frontend
│   ├── nginx.conf                      # nginx config for React Router
│   ├── vite.config.js                  # Vite + proxy config
│   └── package.json
│
└── docker-compose.yml                  # Runs all 3 services together
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Java JDK | 21 | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org |
| Node.js | 20+ | https://nodejs.org |
| MySQL | 8.0 | https://dev.mysql.com/downloads |
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |

---

### Option A — Run Locally (STS + npm)

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/coderank.git
cd coderank
```

#### 2. Set up MySQL

```sql
mysql -u root -p
CREATE DATABASE coderank;
EXIT;
```

#### 3. Pull Docker images for code execution

```bash
docker pull openjdk:17
docker pull python:3.11
docker pull node:18
```

#### 4. Configure the backend

Open `coderank-backend/src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.password=your_mysql_password
```

#### 5. Run the backend

**In Spring Tool Suite (STS):**
```
File → Import → Maven → Existing Maven Projects → Browse to coderank-backend
Right-click CoderankApplication.java → Run As → Spring Boot App
```

**Or using Maven:**
```bash
cd coderank-backend
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

#### 6. Run the frontend

```bash
cd coderank-frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### Option B — Run with Docker Compose

```bash
# Pull execution images first
docker pull openjdk:17
docker pull python:3.11
docker pull node:18

# Start everything
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend | http://localhost:8080 |
| MySQL | localhost:3306 |

**Stop all services:**
```bash
docker-compose down
```

---

## 📡 API Reference

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Response `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "alice",
  "email": "alice@example.com",
  "message": "Authentication successful"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "alice",
  "password": "secret123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "alice",
  "email": "alice@example.com",
  "message": "Authentication successful"
}
```

---

### Code Execution

#### Execute Code
```http
POST /api/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "language": "python",
  "code": "print('Hello, CodeRank!')",
  "input": ""
}
```

**Response `200 OK` — Success:**
```json
{
  "status": "SUCCESS",
  "output": "Hello, CodeRank!",
  "error": "",
  "executionTime": "0.83s"
}
```

**Response `200 OK` — Error:**
```json
{
  "status": "RUNTIME_ERROR",
  "output": "",
  "error": "NameError: name 'x' is not defined on line 1",
  "executionTime": "0.21s"
}
```

#### Execution History
```http
GET /api/executions/history
Authorization: Bearer <token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 42,
    "language": "python",
    "status": "SUCCESS",
    "output": "Hello, CodeRank!",
    "error": "",
    "sourceCode": "print('Hello, CodeRank!')",
    "executionTime": "0.83s",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

---

### Status Codes

| Status | Meaning |
|---|---|
| `SUCCESS` | Code ran and produced output |
| `COMPILATION_ERROR` | Syntax error (Java) |
| `RUNTIME_ERROR` | Code crashed at runtime |
| `TIMEOUT` | Exceeded 5 second limit |
| `SYSTEM_ERROR` | Server-side Docker issue |

---

## 🔒 Security Design

| Mechanism | Detail |
|---|---|
| **JWT (HS256)** | 256-bit HMAC secret, 24h expiry, stateless — no server sessions |
| **BCrypt** | Password hashed with strength 12 (~300ms per hash — brute-force resistant) |
| **Docker isolation** | `--network=none` — code cannot make any network calls |
| **Resource limits** | `--memory=256m --cpus=0.5` per container |
| **Auto-destroy** | `--rm` flag removes container immediately after execution |
| **Timeout** | `process.waitFor(5, TimeUnit.SECONDS)` — kills runaway processes |
| **CORS** | Explicit allow-list — no wildcard origins |

---

## 🧩 Design Patterns Used

| Pattern | Where | Benefit |
|---|---|---|
| **Strategy** | `CodeExecutor` interface | Each language is a plug-in class |
| **Factory** | `ExecutorFactory` | Maps language string → executor bean |
| **Template Method** | `AbstractDockerExecutor` | Docker lifecycle written once, shared by all executors |
| **Builder** | `User`, `Execution`, `ExecutionResult` | Clean object construction |
| **Repository** | `UserRepository`, `ExecutionRepository` | Spring Data JPA CRUD abstraction |

---

## ➕ Adding a New Language

To add **C++** support:

**1. Create the executor:**
```java
@Component
public class CppExecutor extends AbstractDockerExecutor {

    @Override
    protected String getDockerImage() { return "gcc:13"; }

    @Override
    protected String getFileName() { return "solution.cpp"; }

    @Override
    protected List<String> buildDockerCommand(Path tempPath, String input) {
        return Arrays.asList(
            "docker", "run", "--rm", "--memory=256m", "--cpus=0.5",
            "--network=none", "-v", tempPath.toAbsolutePath() + ":/code",
            "-w", "/code", getDockerImage(),
            "sh", "-c", "g++ solution.cpp -o solution && ./solution"
        );
    }
}
```

**2. Add to enum:**
```java
public enum Language { JAVA, PYTHON, JAVASCRIPT, CPP }
```

**3. Register in factory:**
```java
registry.put(Language.CPP, cppExecutor);
```

**4. Add to frontend language selector:**
```js
{ value: 'cpp', label: 'C++', icon: '⚙️', monacoLang: 'cpp', template: '// C++ code here' }
```

**That is all. No other files need to change.**

---

## 🗄️ Database Schema

### users
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt hashed) |
| role | VARCHAR(20) | DEFAULT 'USER' |
| created_at | DATETIME | AUTO |

### executions
| Column | Type | Constraint |
|---|---|---|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT | FOREIGN KEY → users.id |
| language | ENUM | NOT NULL |
| source_code | TEXT | NOT NULL |
| output | TEXT | NULLABLE |
| error | TEXT | NULLABLE |
| status | ENUM | NOT NULL |
| execution_time | VARCHAR(20) | NULLABLE |
| created_at | DATETIME | AUTO |

---

## ⚙️ Configuration

All settings are in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/coderank
spring.datasource.username=root
spring.datasource.password=password

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000        # 24 hours

# Code execution
app.execution.timeout=5            # seconds before kill
app.execution.temp-dir=/tmp/coderank

# CORS
app.cors.allowed-origins=http://localhost:5173
```

---

## 🐳 Docker Commands Reference

```bash
# Build backend image
docker build -t coderank-backend ./coderank-backend

# Build frontend image
docker build -t coderank-frontend ./coderank-frontend

# Run backend container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/coderank" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -v /var/run/docker.sock:/var/run/docker.sock \
  coderank-backend

# Run frontend container
docker run -p 80:80 coderank-frontend

# Run everything with Docker Compose
docker-compose up --build

# Stop everything
docker-compose down

# Stop and wipe database
docker-compose down -v
```

---

## 🔧 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `Failed to obtain JDBC Connection` | MySQL not running | `services.msc → MySQL80 → Start` |
| `Port 8080 already in use` | Another app on 8080 | `netstat -ano \| findstr :8080` then `taskkill /PID <id> /F` |
| `SYSTEM_ERROR` on code run | Docker not running | Open Docker Desktop, wait for "Engine running" |
| Blank screen after login | Backend not running | Check STS Console for errors |
| `Network Error` in browser | Backend unreachable | Verify backend is on port 8080 |
| `Unknown database 'coderank'` | DB not created | `mysql -u root -p -e "CREATE DATABASE coderank;"` |

---

## 🚀 Future Improvements

- [ ] WebSocket streaming — see output in real time as it runs
- [ ] Support C++, Go, Rust, PHP
- [ ] Problem sets with test cases (like LeetCode)
- [ ] Rate limiting per user
- [ ] Code sharing via short URLs
- [ ] Admin dashboard with usage statistics
- [ ] Collaborative editing (multiple users, same editor)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [Hiremath-Prajwal](https://github.com/Hiremath-Prajwal)
- Email: prajwalrh2002@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License — free to use, modify, and distribute.
```

---

## 🙏 Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — the code editor that powers VS Code
- [Spring Boot](https://spring.io/projects/spring-boot) — Java application framework
- [Docker](https://www.docker.com/) — containerized code execution
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
