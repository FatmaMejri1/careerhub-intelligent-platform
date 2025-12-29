# 🏗️ ARCHITECTURE SYSTÈME - Smart Career Hub

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Style architectural actuel](#style-architectural-actuel)
3. [Architecture cible proposée](#architecture-cible-proposée)
4. [Frontend Angular](#frontend-angular)
5. [Backend Java Spring Boot](#backend-java-spring-boot)
6. [Microservices Python (IA)](#microservices-python-ia)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [DevOps & Infrastructure](#devops--infrastructure)

---

## 🎯 Vue d'ensemble

### Projet actuel
- **Framework Backend** : Spring Boot 3.5.6 (Java 17)
- **Base de données** : PostgreSQL
- **Sécurité** : Spring Security + JWT
- **Documentation** : OpenAPI (Swagger)
- **Architecture** : Monolithique avec architecture en couches

### Architecture cible
- **Frontend** : Angular (Application SPA)
- **Backend principal** : Spring Boot (API RESTful)
- **IA/Machine Learning** : Microservices Python
- **DevOps** : CI/CD avec Docker, Kubernetes, GitHub Actions

---

## 🏛️ Style architectural actuel

### Architecture en couches (Layered Architecture)

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                    │
│           (Controllers - REST API)              │
│  - ChercheurController                          │
│  - OffreController                              │
│  - CandidatureController                        │
│  - AdministrateurController                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│           Business Layer                        │
│           (Services)                            │
│  - ChercheurEmploiService                       │
│  - OffreService                                 │
│  - CandidatureService                           │
│  - SystemeIAService                             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│           Data Access Layer                     │
│           (Repositories)                        │
│  - ChercheurEmploiRepository                    │
│  - OffreRepository                              │
│  - CandidatureRepository                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│           Database Layer                        │
│           PostgreSQL                            │
└─────────────────────────────────────────────────┘
```

### Caractéristiques
✅ **Architecture en couches traditionnelle** (Layered Architecture)  
✅ **Pattern MVC** (Model-View-Controller)  
✅ **Injection de dépendances** (Dependency Injection)  
✅ **Repository Pattern**  
✅ **API RESTful**

### Limitations actuelles
- ❌ Couplage avec le service IA (intégré dans le monolithe)
- ❌ Frontend non séparé
- ❌ Pas de CI/CD automatisé
- ❌ Pas de conteneurisation

---

## 🚀 Architecture cible proposée

### Architecture hybride : Microservices + Monolithique modulaire

```
┌─────────────────────────────────────────────────────────────────────┐
│                            FRONTEND                                  │
│                    Angular Application                              │
│  - Component-based Architecture                                     │
│  - Services pour API calls                                          │
│  - State Management (NgRx)                                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/REST
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                                  │
│                    (Spring Cloud Gateway)                           │
│  - Routing                                                           │
│  - Load Balancing                                                   │
│  - Authentication/Authorization                                     │
└─────────────────────────────────────────────────────────────────────┘
           ↓                    ↓                        ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   BACKEND CORE   │  │  AI MICROSERVICE │  │  NOTIFICATION    │
│  Spring Boot API │  │   Python Flask   │  │   Microservice   │
│                  │  │                  │  │                  │
│ - Utilisateurs   │  │ - Matching IA    │  │ - Emails         │
│ - Offres         │  │ - Recommandation │  │ - Push           │
│ - Candidatures   │  │ - NLP            │  │ - SMS            │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         ↓                        ↓                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │   MongoDB    │  │   Redis      │              │
│  │   (Core DB)  │  │   (AI Data)  │  │   (Cache)    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend Angular

### Structure proposée

```
smart-career-hub-frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Services singleton
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── offre.service.ts
│   │   │   │   └── candidature.service.ts
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   ├── shared/            # Composants partagés
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   └── pipes/
│   │   ├── features/          # Modules fonctionnels
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   └── auth.module.ts
│   │   │   ├── offre/
│   │   │   │   ├── components/
│   │   │   │   │   ├── offre-list/
│   │   │   │   │   └── offre-detail/
│   │   │   │   └── offre.module.ts
│   │   │   └── candidature/
│   │   └── app.component.ts
│   ├── assets/
│   └── environments/
├── angular.json
└── package.json
```

### Technologies recommandées

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/material": "^17.0.0",
    "@ngrx/store": "^17.0.0",
    "@ngrx/effects": "^17.0.0",
    "@angular/cdk": "^17.0.0",
    "rxjs": "^7.5.0",
    "axios": "^1.6.0"
  }
}
```

### Exemple de service Angular

```typescript
// offre.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from '../models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:9091/api/offre';

  constructor(private http: HttpClient) { }

  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }

  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/${id}`);
  }

  createOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(this.apiUrl, offre);
  }
}
```

---

## ☕ Backend Java Spring Boot

### Architecture actuelle à maintenir

```
src/main/java/
├── controller/        # API REST Controllers
├── service/          # Business Logic
├── repository/       # Data Access
├── entity/           # JPA Entities
├── security/         # Security Configuration
└── exception/        # Exception Handling
```

### Modifications nécessaires

#### 1. Ajouter CORS pour Angular

```java
// SecurityConfig.java
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200")); // Angular
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### 2. Refactoriser le service IA

```java
@Service
public class MatchingService {
    
    private final AIServiceClient aiServiceClient; // Client HTTP pour microservice Python

    public List<Offre> matchOffresPourChercheur(Long chercheurId) {
        // Appel au microservice IA Python
        return aiServiceClient.getRecommendedOffres(chercheurId);
    }
}
```

---

## 🐍 Microservices Python (IA)

### Architecture Python Flask

```
ai-microservice/
├── app/
│   ├── __init__.py
│   ├── main.py              # Application Flask
│   ├── models/
│   │   ├── matching_model.py
│   │   └── recommendation_model.py
│   ├── services/
│   │   ├── matching_service.py
│   │   └── nlp_service.py
│   └── api/
│       ├── matching_api.py
│       └── recommendation_api.py
├── requirements.txt
├── Dockerfile
└── README.md
```

### Exemple de service Python

```python
# app/main.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

@app.route('/api/v1/match-offres', methods=['POST'])
def match_offres():
    data = request.json
    chercheur_id = data.get('chercheur_id')
    
    # Logique de matching IA
    matching_scores = calculate_matching_scores(chercheur_id)
    
    return jsonify({
        'chercheur_id': chercheur_id,
        'matches': matching_scores
    })

def calculate_matching_scores(chercheur_id):
    # Implémentation de l'algorithme de matching
    # Utilisation de TF-IDF, cosine similarity, etc.
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Requirements Python

```txt
Flask==3.0.0
Flask-CORS==4.0.0
pandas==2.0.0
scikit-learn==1.3.0
numpy==1.24.0
requests==2.31.0
```

---

## 🔄 CI/CD Pipeline

### Architecture CI/CD avec GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # 1. Tests Backend
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run tests
        run: mvn test
      - name: Build JAR
        run: mvn clean package -DskipTests

  # 2. Tests Frontend
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run test
      - run: cd frontend && npm run build

  # 3. Tests IA Microservice
  test-ai-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd ai-microservice && pip install -r requirements.txt
      - run: cd ai-microservice && pytest

  # 4. Build Docker Images
  build-and-push:
    needs: [test-backend, test-frontend, test-ai-service]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build backend image
        run: |
          docker build -t smartcareerhub/backend:latest ./backend
      - name: Build frontend image
        run: |
          docker build -t smartcareerhub/frontend:latest ./frontend
      - name: Build AI service image
        run: |
          docker build -t smartcareerhub/ai-service:latest ./ai-microservice
      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push smartcareerhub/backend:latest
          docker push smartcareerhub/frontend:latest
          docker push smartcareerhub/ai-service:latest

  # 5. Deploy to Kubernetes
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend backend=smartcareerhub/backend:latest
          kubectl set image deployment/frontend frontend=smartcareerhub/frontend:latest
          kubectl set image deployment/ai-service ai-service=smartcareerhub/ai-service:latest
```

### Dockerfiles

#### Backend Dockerfile

```dockerfile
# Backend Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 9091

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/smart-career-hub /usr/share/nginx/html
EXPOSE 80
```

#### AI Microservice Dockerfile

```dockerfile
# AI Microservice Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app/main.py"]
```

---

## ☸️ DevOps & Infrastructure

### Kubernetes Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: smartcareerhub/backend:latest
        ports:
        - containerPort: 9091
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 9091
  type: LoadBalancer
```

### Docker Compose (pour développement local)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: smarthub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "9091:9091"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/smarthub

  ai-service:
    build: ./ai-microservice
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 📊 Diagramme d'architecture complet

```
┌─────────────────────────────────────────────────────────────────────┐
│                           INTERNET/USERS                             │
└────────────────────────────────┬────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         LOAD BALANCER                                │
│                            (Nginx)                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 ↓
        ┌────────────────────────┼────────────────────────┐
        ↓                        ↓                        ↓
┌───────────────┐      ┌────────────────┐      ┌─────────────────┐
│   FRONTEND    │      │   BACKEND      │      │   AI SERVICE    │
│   Angular     │ ←──→ │   Spring Boot  │ ←──→ │   Python Flask  │
│   (Nginx)     │      │   (Java 17)    │      │   (Python 3.11) │
└───────────────┘      └────────────────┘      └─────────────────┘
        │                        ↓                        ↓
        └────────────────────────┼────────────────────────┘
                                 ↓
                 ┌───────────────────────────────┐
                 │       POSTGRESQL DB           │
                 │   + MongoDB + Redis Cache     │
                 └───────────────────────────────┘
                                 ↓
                 ┌───────────────────────────────┐
                 │    DOCKER + KUBERNETES        │
                 └───────────────────────────────┘
```

---

## 🎯 Plan de migration

### Phase 1 : Développement (Semaine 1-2)
- ✅ Créer projet Angular
- ✅ Ajouter CORS au backend Spring Boot
- ✅ Développer les composants Angular de base
- ✅ Connecter frontend et backend

### Phase 2 : Microservice IA (Semaine 3)
- ✅ Créer microservice Python
- ✅ Implémenter l'API de matching
- ✅ Connecter Spring Boot au microservice Python
- ✅ Tests d'intégration

### Phase 3 : DevOps (Semaine 4)
- ✅ Créer les Dockerfiles
- ✅ Configurer docker-compose
- ✅ Créer le pipeline CI/CD GitHub Actions
- ✅ Déployer sur Kubernetes (optionnel)

---

## 📝 Checklist de mise en œuvre

### Backend Spring Boot
- [x] Architecture en couches existante
- [ ] Ajouter CORS
- [ ] Créer client HTTP pour microservice IA
- [ ] Créer Dockerfile
- [ ] Ajouter tests d'intégration

### Frontend Angular
- [ ] Créer projet Angular
- [ ] Créer services HTTP
- [ ] Implémenter l'authentification
- [ ] Développer les composants principaux
- [ ] Configurer le routing
- [ ] Créer Dockerfile

### Microservice IA Python
- [ ] Créer structure Flask
- [ ] Implémenter l'algorithme de matching
- [ ] Créer l'API REST
- [ ] Ajouter les tests unitaires
- [ ] Créer Dockerfile

### DevOps/CI/CD
- [ ] Configurer GitHub Actions
- [ ] Créer docker-compose.yml
- [ ] Configurer Kubernetes (optionnel)
- [ ] Configurer monitoring (Prometheus/Grafana)
- [ ] Mettre en place les logs (ELK Stack)

---

**Date de création** : 2024  
**Architecture** : Microservices hybride  
**Technologies** : Angular + Spring Boot + Python Flask + Docker + Kubernetes
