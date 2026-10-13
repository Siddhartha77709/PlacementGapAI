# PlacementGap AI — Full-Stack Verification & Execution Guide

PlacementGap AI is a full-stack, enterprise-grade Placement Readiness platform powered by **React 18 + Vite**, **Spring Boot 3.3.5**, **Hibernate / JPA**, and **Google Gemini AI**.

---

## 🌟 Key Features

1. **Candidate Profile Management**: Maintain candidate contact details, target roles, current competencies, resume text, and portfolio projects.
2. **AI-Powered Gap Analysis**: Direct real-time analysis against employer job descriptions using Google Gemini (`gemini-3.1-flash-lite` / `gemini-3.5-flash` with multi-model automatic fallback).
3. **Skill Diagnostics**: Categorizes competencies into **Missing Skills** (High Priority), **Weak Skills** (Medium Priority), and **Mastered Skills**.
4. **Actionable Roadmap**: Tailored 6-stage curriculum spanning Core Learning, Hands-on Portfolio Projects, and Technical Interview Prep with direct documentation links.
5. **Real-Time Progress Tracking & Readiness Gauge**: Dynamic placement readiness score scaling from base fit up to 100% as milestones are completed, with per-track progress breakdown bars and idempotent database persistence.
6. **Enterprise UI/UX**: Premium SaaS dashboard featuring Tailwind CSS styling, responsive sidebar navigation, SVG readiness gauges, and status badges.

---

## 🏗️ Architecture

```
PlacementGap-AI/
├── backend/
│   ├── src/main/java/ai/placementgap/
│   │   ├── controller/      # PlacementGapController, GlobalExceptionHandler
│   │   ├── dto/             # Typed request/response DTOs
│   │   ├── model/           # CandidateProfile, Analysis, SkillGap, RoadmapItem
│   │   ├── repository/      # Spring Data JPA repositories
│   │   └── service/         # GeminiAiService (with retry & fallback), AnalysisService, ProfileService
│   ├── src/main/resources/  # application.properties, application-local.properties
│   ├── schema.sql           # Normalized MySQL DDL schema
│   └── pom.xml              # Maven configuration (Java 17, Spring Boot 3.3.5, H2 test/local)
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Navbar, ScoreGauge, EmptyState
│   │   ├── pages/           # DashboardPage, ProfilePage, AnalysisPage, GapsPage, RoadmapPage, ProgressPage
│   │   ├── api.js           # REST API client with error handling
│   │   ├── App.jsx          # Route management & global state
│   │   └── main.jsx         # React DOM root
│   ├── vite.config.js       # Vite proxy to backend port 8080
│   └── package.json         # React 18, Lucide React, Tailwind CSS
└── maven/                   # Local Maven wrapper
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (JDK 17)
- **Node.js 20+** / npm
- **Maven 3.9+** (or use included `.\maven\apache-maven-3.9.9\bin\mvn.cmd`)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### 1. Run the Backend

#### Option A: Local Evaluation (H2 In-Memory — Zero DB Setup)
```powershell
# Set your Gemini API Key
$env:GEMINI_API_KEY = "your-gemini-api-key"

# Build and start backend
.\maven\apache-maven-3.9.9\bin\mvn.cmd -f backend/pom.xml clean package -DskipTests
java -jar backend/target/placementgap-api-1.0.0.jar --spring.profiles.active=local
```

#### Option B: Production MySQL / Aiven Cloud
```powershell
$env:DB_URL = "jdbc:mysql://YOUR-HOST:3306/placementgap?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:DB_USERNAME = "your-username"
$env:DB_PASSWORD = "your-password"
$env:GEMINI_API_KEY = "your-gemini-api-key"

java -jar backend/target/placementgap-api-1.0.0.jar
```

The backend server starts on **http://localhost:8080**.

---

### 2. Run the Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend development server starts on **http://localhost:5173**.  
Requests to `/api/*` are automatically proxied to `http://localhost:8080`.

---

## 🧪 Automated Test Suite

All 8 backend unit and integration tests are passing:
```powershell
.\maven\apache-maven-3.9.9\bin\mvn.cmd -f backend/pom.xml test
```

Test Results:
- `PlacementGapControllerTest`: 5 / 5 passed
- `AnalysisServiceTest`: 3 / 3 passed
- **Total: 8 tests, 0 failures, 0 errors, 0 skipped**

Frontend Production Build:
```powershell
npm --prefix frontend run build
```
- Transpiles cleanly via Vite / Rollup with zero errors.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/profile` | Retrieve active candidate profile |
| `POST` | `/api/v1/profile` | Save or update candidate profile |
| `POST` | `/api/v1/analyze` | Run full PlacementGap analysis with Gemini AI |
| `GET` | `/api/v1/progress` | Fetch latest readiness score, skill counts, and completed IDs |
| `GET` | `/api/v1/roadmap` | Retrieve the structured learning & execution roadmap |
| `POST` | `/api/v1/progress/{id}/complete` | Mark a roadmap module complete & recalculate readiness |

---

## 🛡️ Security Best Practices
- Never commit `GEMINI_API_KEY`, database passwords, or credentials into version control.
- All secrets are managed via external environment variables (`GEMINI_API_KEY`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- Spring Boot sanitizes and suppresses secret leakage in all logs and error responses.
