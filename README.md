<div align="center">

# 🎯 CareerHub — Intelligent Platform

### _AI-Powered Career Management & Smart Recruitment_

**CareerHub** is an advanced, full-stack employment platform that reimagines the hiring process. By integrating cutting-edge AI technologies, it empowers candidates with personalized career mapping and automated CV tools, equips recruiters with smart applicant matching and insights, and provides administrators with robust management and AI-driven fraud detection. Built with a modern microservices architecture, it ensures a seamless, scalable, and intelligent recruitment ecosystem.

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br/>

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00?style=flat-square&logo=databricks&logoColor=white)](https://www.trychroma.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io/)

---

**CareerHub** connects **candidates**, **recruiters**, and **administrators** through AI-driven workflows — from smart CV analysis and automated quiz generation to fraud detection and personalized job recommendations.

[🚀 Getting Started](#-getting-started) · [✨ Features](#-features) · [🔄 CI/CD](#-cicd-pipeline-github-actions) · [🏗️ Architecture](#️-architecture) · [📖 API Docs](#-api-documentation)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 Candidate Portal
- 📄 **CV Manager** — Upload, parse & manage résumés (PDF/Word)
- 🤖 **AI CV Generator** — Generate tailored CVs with PDF export
- 📊 **Smart Dashboard** — Track applications & career progress
- 🎓 **Training Hub** — AI-recommended courses & certifications
- 🎯 **Job Matching** — AI-powered job recommendations
- 📝 **AI Quiz Assessment** — Skill evaluation with adaptive difficulty

</td>
<td width="50%">

### 🏢 Recruiter Portal
- 📋 **Job Offer Management** — Create, edit & publish listings
- 👥 **Candidate Browser** — Search & filter applicant profiles
- 📈 **Analytics Dashboard** — Hiring metrics & insights
- ⚙️ **Settings & Preferences** — Custom workflow configuration

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ Admin Panel
- 👁️ **User Management** — Full CRUD on all platform users
- 🚨 **Fraud Detection** — AI-powered profile authenticity analysis
- 📢 **Notifications Center** — Platform-wide announcements
- 📑 **Offer Oversight** — Monitor & moderate all job listings

</td>
<td width="50%">

### 🧠 AI Intelligence Engine
- 🔍 **CV Analysis** — Deep résumé parsing & scoring
- 🧪 **Quiz Generation** — Auto-generated skill assessments via Gemini
- 🎯 **Job Recommendations** — Profile-based opportunity matching
- 📚 **Course Recommender** — Vector-search enhanced learning paths
- 🛡️ **Fraud Analyzer** — Multi-signal profile integrity checks
- 📊 **Quiz Scoring** — Automated evaluation with feedback

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        🎯 CareerHub Platform                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│   │  🌐 Frontend  │───▶│   ⚙️ Backend API  │───▶│  🤖 AI Service   │  │
│   │  Angular 21   │    │  Spring Boot 3.5 │    │    FastAPI       │  │
│   │  Port: 4200   │    │   Port: 9099     │    │   Port: 5000    │  │
│   └──────────────┘    └────────┬─────────┘    └────────┬────────┘  │
│                                │                       │            │
│                    ┌───────────┼───────────┐   ┌───────┴────────┐  │
│                    ▼           ▼           ▼   ▼                │  │
│              ┌──────────┐ ┌───────┐ ┌────────────┐     │  │
│              │🐘PostgreSQL│ │ Redis │ │ 🔮 ChromaDB │     │  │
│              │  :5432    │ │Cache  │ │ VectorStore│     │  │
│              └──────────┘ └───────┘ └────────────┘     │  │
│                                                                 │  │
│                                        ┌────────────────────┐   │  │
│                                        │ ✨ Google Gemini AI │   │  │
│                                        │   (LLM Provider)   │   │  │
│                                        └────────────────────┘   │  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

CareerHub is equipped with a robust, fully automated Continuous Integration and Continuous Deployment (CI/CD) pipeline built with **GitHub Actions** (`ci-cd.yml`).

- ⚡ **Parallel CI Checks:** Every push and pull request triggers parallel jobs to install dependencies, run code linting, and execute unit tests across the Angular Frontend, Spring Boot Backend, and Python AI Service.
- 🐳 **Optimized Dockerization:** Features highly optimized, multi-stage `Dockerfile` configurations for all three microservices. The frontend utilizes Nginx for lightning-fast SPA delivery, while the backend utilizes minimal JRE images with container-aware JVM tuning.
- 📦 **Automated GHCR Deployment:** Upon a successful merge to the `main` branch, the pipeline automatically builds the production Docker images using a matrix strategy and publishes them securely to the **GitHub Container Registry (GHCR)**.

---

## 🧩 Tech Stack

### 🌐 Frontend

| Technology | Purpose |
| :--- | :--- |
| ![Angular](https://img.shields.io/badge/-Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white) | SPA framework with SSR support |
| ![TypeScript](https://img.shields.io/badge/-TypeScript_5.9-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type-safe development |
| ![Bootstrap](https://img.shields.io/badge/-Bootstrap_5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white) | Responsive UI components |
| ![Font Awesome](https://img.shields.io/badge/-Font_Awesome_7-528DD7?style=flat-square&logo=fontawesome&logoColor=white) | Icon library |
| ![RxJS](https://img.shields.io/badge/-RxJS_7.8-B7178C?style=flat-square&logo=reactivex&logoColor=white) | Reactive state management |

### ⚙️ Backend

| Technology | Purpose |
| :--- | :--- |
| ![Spring Boot](https://img.shields.io/badge/-Spring_Boot_3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white) | RESTful API framework |
| ![Java](https://img.shields.io/badge/-Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | Core language |
| ![Spring Security](https://img.shields.io/badge/-Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white) | Authentication & authorization |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | Stateless token auth |
| ![Swagger](https://img.shields.io/badge/-SpringDoc_OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black) | Interactive API docs |
| ![Lombok](https://img.shields.io/badge/-Lombok-DC382D?style=flat-square&logo=java&logoColor=white) | Boilerplate reduction |
| ![Apache PDFBox](https://img.shields.io/badge/-Apache_PDFBox-D22128?style=flat-square&logo=apache&logoColor=white) | PDF parsing |
| ![Apache POI](https://img.shields.io/badge/-Apache_POI-D22128?style=flat-square&logo=apache&logoColor=white) | Word document parsing |

### 🤖 AI / ML Service

| Technology | Purpose |
| :--- | :--- |
| ![FastAPI](https://img.shields.io/badge/-FastAPI_0.115-009688?style=flat-square&logo=fastapi&logoColor=white) | High-performance async API |
| ![Google Gemini](https://img.shields.io/badge/-Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white) | LLM provider (quiz, analysis, generation) |
| ![scikit-learn](https://img.shields.io/badge/-scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white) | ML algorithms |
| ![Sentence Transformers](https://img.shields.io/badge/-Sentence_Transformers-FFD43B?style=flat-square&logo=huggingface&logoColor=black) | NLP embeddings |
| ![ChromaDB](https://img.shields.io/badge/-ChromaDB-FF6F00?style=flat-square&logo=databricks&logoColor=white) | Vector similarity search |
| ![NLTK](https://img.shields.io/badge/-NLTK-154F5B?style=flat-square&logo=python&logoColor=white) | Natural language processing |

### 🗄️ Data & Infrastructure

| Technology | Purpose |
| :--- | :--- |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | Primary relational database & AI logs |
| ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | Caching layer |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerization |

---

## 🚀 Getting Started

### 📋 Prerequisites

| Requirement | Version |
| :--- | :--- |
| ![Node.js](https://img.shields.io/badge/-Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) | `18+` |
| ![Java](https://img.shields.io/badge/-Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | `17+` |
| ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | `3.10+` |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | `14+` |
| ![Maven](https://img.shields.io/badge/-Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white) | `3.9+` |

### 🔧 Installation

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/FatmaMejri1/careerhub-intelligent-platform.git
cd careerhub-intelligent-platform
```

#### 2️⃣ Configure the Backend

```bash
cd smart-carrer-hub-backend
```

Update `src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/careerhub
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Build and run:

```bash
mvn clean install
mvn spring-boot:run
```

> 🟢 Backend starts on **http://localhost:9099**

#### 3️⃣ Configure the AI Microservice

```bash
cd microservice-AI
python -m venv venv
```

Activate the virtual environment:

```bash
# 🪟 Windows
venv\Scripts\activate

# 🐧 Linux / macOS
source venv/bin/activate
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

Install dependencies and run:

```bash
pip install -r requirement.txt
python -m app.main
```

> 🟢 AI Service starts on **http://localhost:5000**

#### 4️⃣ Configure the Frontend

```bash
cd smart-career-hub-frontend
npm install
ng serve
```

> 🟢 Frontend starts on **http://localhost:4200**

### ⚡ Quick Start (Execution Order)

```
1. 🗄️  Start PostgreSQL
2. ⚙️  Start Backend          →  mvn spring-boot:run
3. 🤖  Start AI Service       →  python -m app.main
4. 🌐  Start Frontend         →  ng serve
```

---

## 🔌 Service Ports

| Service | Port | Health Check |
| :--- | :---: | :--- |
| 🌐 Angular Frontend | `4200` | http://localhost:4200 |
| ⚙️ Spring Boot API | `9099` | http://localhost:9099/actuator/health |
| 🤖 FastAPI AI Service | `5000` | http://localhost:5000/api/health/health |
| 🐘 PostgreSQL | `5432` | — |

---

## 📖 API Documentation

Once the backend is running, interactive API docs are available at:

| Documentation | URL |
| :--- | :--- |
| 📘 **Swagger UI** (Backend) | http://localhost:9099/swagger-ui.html |
| 📗 **FastAPI Docs** (AI) | http://localhost:5000/docs |
| 📙 **ReDoc** (AI) | http://localhost:5000/redoc |

---

## 📁 Project Structure

```
careerhub-intelligent-platform/
│
├── 🌐 smart-career-hub-frontend/       # Angular 21 SPA
│   ├── src/app/
│   │   ├── core/                        # Guards, interceptors, services
│   │   └── modules/
│   │       ├── admin/                   # 🛡️ Admin dashboard & management
│   │       ├── auth/                    # 🔐 Login & registration
│   │       ├── candidate/              # 👤 Candidate portal
│   │       │   ├── cv-manager/         #    CV upload & management
│   │       │   ├── my-applications/    #    Application tracking
│   │       │   ├── my-profile/         #    Profile management
│   │       │   └── trainings/          #    AI courses & certifications
│   │       ├── recruiter/              # 🏢 Recruiter portal
│   │       │   ├── job-offers/         #    Job posting management
│   │       │   ├── candidates/         #    Applicant browsing
│   │       │   └── analytics/          #    Hiring analytics
│   │       └── shared/                 # 🔗 Common components
│   └── angular.json
│
├── ⚙️ smart-carrer-hub-backend/         # Spring Boot 3.5 API
│   ├── src/main/java/com/smarthub/
│   │   ├── entity/                      # JPA entities
│   │   ├── dto/                         # Data transfer objects
│   │   ├── controller/                  # REST controllers
│   │   ├── service/                     # Business logic
│   │   └── security/                    # JWT & Spring Security
│   └── pom.xml
│
├── 🤖 microservice-AI/                  # FastAPI AI Microservice
│   ├── app/
│   │   ├── api/                         # API routes
│   │   ├── core/                        # Orchestrator & PDF generator
│   │   ├── intelligence/
│   │   │   ├── analyzers/              # CV & fraud analysis
│   │   │   ├── extractors/             # Data extraction
│   │   │   ├── generators/             # Quiz & CV generation
│   │   │   ├── matchers/               # Profile matching
│   │   │   └── recommenders/           # Job & course recommendations
│   │   ├── evaluation/                  # Quiz scoring
│   │   ├── llm/                         # LLM provider abstraction
│   │   └── storage/                     # Cache & vector store
│   ├── Dockerfile
│   └── requirement.txt
│
└── 📄 README.md
```

---

## 🐳 Docker (AI Service)

```bash
cd microservice-AI
docker build -t careerhub-ai .
docker run -p 5000:5000 --env-file .env careerhub-ai
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 📬 Open a Pull Request

---

## 📄 License

This project is developed for **educational and professional development purposes**.

---

<div align="center">

**Built with ❤️ using Angular · Spring Boot · FastAPI · Google Gemini**

</div>
