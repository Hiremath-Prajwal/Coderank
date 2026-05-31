# CodeRank — Frontend

React frontend for the CodeRank Online Code Execution Platform.

---

## What this app does

- **Login / Register** — create an account and sign in
- **Code Editor** — write Java, Python, or JavaScript in a VS Code-quality editor
- **Run Code** — sends your code to the backend which executes it inside Docker
- **Output Console** — shows stdout, stderr, status, and execution time
- **Execution History** — browse all your past runs, expand to see code and output

---

## Prerequisites

Install these before running:

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | 20+      | https://nodejs.org |
| npm        | 9+       | Included with Node.js |

The backend must also be running on **http://localhost:8080**
See the backend README for backend setup.

---

## Option A — Run with npm (Recommended for development)

### Step 1 — Open Command Prompt

Press `Win + R` → type `cmd` → Enter

### Step 2 — Go to the frontend folder

```
cd C:\path\to\coderank-frontend
```

Replace the path with wherever you extracted the zip.
For example:
```
cd C:\Users\YourName\Downloads\coderank-frontend
```

### Step 3 — Install dependencies

```
npm install
```

This downloads all packages listed in package.json.
Takes about 1-2 minutes the first time. Creates a `node_modules` folder.

### Step 4 — Start the development server

```
npm run dev
```

You will see:
```
  VITE v5.0.8  ready in 350ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5 — Open in browser

Go to: **http://localhost:5173**

You will see the CodeRank login page.

### Step 6 — Register and test

1. Click "Create one" to go to the register page
2. Fill in username, email, password
3. Click "Create Account"
4. You land on the Dashboard
5. Select Python, type `print("Hello World")`, click "Run Code"
6. Output panel shows: `Hello World` with a green SUCCESS badge

---

## Option B — Run with Docker Compose

Use this option to run both frontend and backend together with one command.

### Prerequisites for Docker

- Docker Desktop installed and running (whale icon in taskbar)
- Backend `coderank-backend` folder is available

### Folder structure needed

```
coderank/
├── coderank-backend/    ← Spring Boot project
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
└── coderank-frontend/   ← This folder
    ├── package.json
    ├── Dockerfile
    └── src/
```

### docker-compose.yml

Create a file called `docker-compose.yml` in the `coderank/` root folder:

```yaml
version: '3.8'

services:

  mysql:
    image: mysql:8.0
    container_name: coderank-mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: coderank
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./coderank-backend
      dockerfile: Dockerfile
    container_name: coderank-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/coderank?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: password
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      mysql:
        condition: service_healthy

  frontend:
    build:
      context: ./coderank-frontend
      dockerfile: Dockerfile
    container_name: coderank-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Run all services

```
cd C:\path\to\coderank
docker-compose up --build
```

Open browser: **http://localhost**

### Stop all services

```
docker-compose down
```

---

## Proxy configuration

`vite.config.js` is already configured to proxy API calls:

```js
proxy: {
  '/auth': { target: 'http://localhost:8080', changeOrigin: true },
  '/api':  { target: 'http://localhost:8080', changeOrigin: true },
}
```

This means when your React code calls `/auth/login`, Vite
automatically forwards it to `http://localhost:8080/auth/login`.
No CORS issues during local development.

---

## Folder structure

```
coderank-frontend/
├── index.html                   ← HTML entry point
├── package.json                 ← Dependencies
├── vite.config.js               ← Dev server + proxy settings
├── tailwind.config.js           ← CSS utility config
├── Dockerfile                   ← For Docker deployment
└── src/
    ├── main.jsx                 ← React app entry point
    ├── App.jsx                  ← Page routes
    ├── index.css                ← Global styles
    │
    ├── context/
    │   └── AuthContext.jsx      ← Global login state (token + user)
    │
    ├── services/
    │   └── api.js               ← All HTTP calls to backend (Axios)
    │
    ├── routes/
    │   └── ProtectedRoute.jsx   ← Redirects to login if not authenticated
    │
    ├── pages/
    │   ├── LoginPage.jsx        ← /login
    │   ├── RegisterPage.jsx     ← /register
    │   └── DashboardPage.jsx    ← /dashboard (main editor page)
    │
    └── components/
        ├── common/
        │   └── Navbar.jsx           ← Top bar with user menu
        ├── editor/
        │   ├── LanguageSelector.jsx ← Java/Python/JS buttons
        │   └── CodeEditor.jsx       ← Monaco editor
        ├── output/
        │   └── OutputConsole.jsx    ← Shows stdout, stderr, status
        └── history/
            └── ExecutionHistory.jsx ← Past runs list
```

---

## Common problems

**npm install fails**
```
# Delete node_modules and try again
rmdir /s /q node_modules
npm install
```

**"npm" is not recognized**
- Node.js is not installed or not in PATH
- Download from https://nodejs.org and reinstall

**Blank screen after login**
- Backend is not running
- Start the Spring Boot backend first, then refresh the page

**"Network Error" when running code**
- Backend is not running on port 8080
- Check STS console — backend must show "Started CoderankApplication"

**Port 5173 already in use**
- Change port in vite.config.js:
  ```js
  server: { port: 5174 }
  ```

---

## API endpoints used

| Page | Method | Endpoint |
|------|--------|----------|
| Register | POST | /auth/register |
| Login | POST | /auth/login |
| Run Code | POST | /api/execute |
| History | GET | /api/executions/history |
