# Smart Career Hub - API Endpoints Guide

## Base URL
`http://localhost:9091`

## Test Endpoint
- **GET** `/api/test/hello` - Returns "Backend Smart Career Hub fonctionne ✅"

---

## 1. Administrateur (Admin) - `/api/admin`

### Endpoints à tester
- `GET /api/admin`
- `GET /api/admin/{id}`
- `POST /api/admin`
- `PUT /api/admin/{id}`
- `DELETE /api/admin/{id}`
- `POST /api/admin/{adminId}/notifications`
- `GET /api/admin/{adminId}/notifications`

### CRUD Operations
- **GET** `/api/admin` - Get all admins
- **GET** `/api/admin/{id}` - Get admin by ID
- **POST** `/api/admin` - Create admin
  ```json
  {
    "nom": "Alice",
    "prenom": "Martin",
    "email": "admin@example.com",
    "motDePasse": "secret"
  }
  ```
- **PUT** `/api/admin/{id}` - Update admin
- **DELETE** `/api/admin/{id}` - Delete admin

### Additional Endpoints
- **POST** `/api/admin/{adminId}/notifications` - Add notification to admin
- **GET** `/api/admin/{adminId}/notifications` - Get admin notifications

---

## 2. Recruteur (Recruiter) - `/api/recruteur`

### Endpoints à tester
- `GET /api/recruteur`
- `GET /api/recruteur/{id}`
- `POST /api/recruteur`
- `PUT /api/recruteur/{id}`
- `DELETE /api/recruteur/{id}`

### CRUD Operations
- **GET** `/api/recruteur` - Get all recruiters
- **GET** `/api/recruteur/{id}` - Get recruiter by ID
- **POST** `/api/recruteur` - Create recruiter
  ```json
  {
    "nom": "Recruit",
    "prenom": "Rick",
    "email": "recruiter@example.com",
    "motDePasse": "recpass",
    "role": "ROLE_RECRUTEUR"
  }
  ```
- **PUT** `/api/recruteur/{id}` - Update recruiter
- **DELETE** `/api/recruteur/{id}` - Delete recruiter

---

## 3. Chercheur Emploi (Job Seeker) - `/api/chercheur`

### Endpoints à tester
- `GET /api/chercheur`
- `GET /api/chercheur/{id}`
- `POST /api/chercheur`
- `PUT /api/chercheur/{id}`
- `DELETE /api/chercheur/{id}`
- `POST /api/chercheur/{chercheurId}/quiz`
- `GET /api/chercheur/{chercheurId}/quiz`
- `POST /api/chercheur/{chercheurId}/coaching`
- `GET /api/chercheur/{chercheurId}/coaching`

### CRUD Operations
- **GET** `/api/chercheur` - Get all job seekers
- **GET** `/api/chercheur/{id}` - Get job seeker by ID
- **POST** `/api/chercheur` - Create job seeker
  ```json
  {
    "nom": "Candidate",
    "prenom": "Chloe",
    "email": "candidate@example.com",
    "motDePasse": "candpass",
    "role": "ROLE_CANDIDAT"
  }
  ```
- **PUT** `/api/chercheur/{id}` - Update job seeker
- **DELETE** `/api/chercheur/{id}` - Delete job seeker

### Additional Endpoints
- **POST** `/api/chercheur/{chercheurId}/quiz` - Add quiz to job seeker
- **GET** `/api/chercheur/{chercheurId}/quiz` - Get quizzes by job seeker
- **POST** `/api/chercheur/{chercheurId}/coaching` - Add coaching to job seeker
- **GET** `/api/chercheur/{chercheurId}/coaching` - Get coachings by job seeker

---

## 4. Offre (Job Offer) - `/api/offre`

### Endpoints à tester
- `GET /api/offre`
- `GET /api/offre/{id}`
- `POST /api/offre`
- `PUT /api/offre/{id}`
- `DELETE /api/offre/{id}`

### CRUD Operations
- **GET** `/api/offre` - Get all job offers
- **GET** `/api/offre/{id}` - Get job offer by ID
- **POST** `/api/offre` - Create job offer
  ```json
  {
    "titre": "Java Developer",
    "description": "Backend development role",
    "statut": "ACTIVE"
  }
  ```
  Note: To link to a recruiter, include `recruteur` object with `id`:
  ```json
  {
    "titre": "Java Developer",
    "description": "Backend development role",
    "statut": "ACTIVE",
    "recruteur": {"id": 2}
  }
  ```
- **PUT** `/api/offre/{id}` - Update job offer
- **DELETE** `/api/offre/{id}` - Delete job offer

### Statut Values
- `ACTIVE`
- `INACTIVE`
- `CLOSED`

---

## 5. Candidature (Application) - `/api/candidature`

### Endpoints à tester
- `GET /api/candidature`
- `GET /api/candidature/{id}`
- `POST /api/candidature`
- `POST /api/candidature/chercheur/{chercheurId}/offre/{offreId}`
- `PUT /api/candidature/{id}`
- `PUT /api/candidature/{id}/statut?statut=...`
- `DELETE /api/candidature/{id}`
- `GET /api/candidature/chercheur/{chercheurId}`
- `GET /api/candidature/offre/{offreId}`

### CRUD Operations
- **GET** `/api/candidature` - Get all applications
- **GET** `/api/candidature/{id}` - Get application by ID
- **POST** `/api/candidature` - Create application (with DTO body)
  ```json
  {
    "chercheurId": 3,
    "offreId": 1,
    "statut": "EN_ATTENTE"
  }
  ```
- **POST** `/api/candidature/chercheur/{chercheurId}/offre/{offreId}` - Create application (with path variables)
  - Links a job seeker to a job offer
- **PUT** `/api/candidature/{id}` - Update application
  ```json
  {
    "chercheurId": 3,
    "offreId": 1,
    "statut": "ACCEPTEE"
  }
  ```
- **PUT** `/api/candidature/{id}/statut?statut={STATUT}` - Update application status
  - Statut values: `EN_ATTENTE`, `ACCEPTEE`, `REFUSEE`
- **DELETE** `/api/candidature/{id}` - Delete application

### Additional Endpoints
- **GET** `/api/candidature/chercheur/{chercheurId}` - Get applications by job seeker
- **GET** `/api/candidature/offre/{offreId}` - Get applications by job offer

---

## 6. Notification - `/api/notification`

⚠️ **Note importante**: Les notifications sont générées automatiquement par le système. Seuls les endpoints GET sont disponibles.

### Endpoints à tester
- `GET /api/notification`
- `GET /api/notification/{id}`
- `POST /api/admin/{adminId}/notifications`
- `GET /api/admin/{adminId}/notifications`

### Read Operations (GET only)
- **GET** `/api/notification` - Get all notifications (générées par le système)
- **GET** `/api/notification/{id}` - Get notification by ID

### Création via Administrateur
Les notifications sont créées via l'endpoint Administrateur:
- **POST** `/api/admin/{adminId}/notifications` - Create notification (via système)
  ```json
  {
    "message": "Your application has been reviewed",
    "type": "INFO"
  }
  ```

---

## 7. Formation (Training) - `/api/formation`

⚠️ **Note importante**: Les formations sont générées par le système IA. Seuls les endpoints GET sont disponibles.

### Endpoints à tester
- `GET /api/formation`
- `GET /api/formation/{id}`
- `POST /api/chercheur/{chercheurId}/formation`

### Read Operations (GET only)
- **GET** `/api/formation` - Get all formations (générées par le système IA)
- **GET** `/api/formation/{id}` - Get formation by ID

### Création via Chercheur (Système IA)
Les formations sont créées via le système IA via ChercheurController:
- **POST** `/api/chercheur/{chercheurId}/formation` - Create formation (via système IA)
  ```json
  {
    "nom": "Java Advanced",
    "description": "Advanced Java programming course"
  }
  ```

---

## 8. Coaching - `/api/coaching`

⚠️ **Note importante**: Les coachings sont générés par le système IA. Seuls les endpoints GET sont disponibles.

### Endpoints à tester
- `GET /api/coaching`
- `GET /api/coaching/{id}`
- `GET /api/coaching/chercheur/{chercheurId}`
- `POST /api/chercheur/{chercheurId}/coaching`

### Read Operations (GET only)
- **GET** `/api/coaching` - Get all coachings (générés par le système IA)
- **GET** `/api/coaching/{id}` - Get coaching by ID
- **GET** `/api/coaching/chercheur/{chercheurId}` - Get coachings by job seeker

### Création via Chercheur (Système IA)
Les coachings sont créés via le système IA via ChercheurController:
- **POST** `/api/chercheur/{chercheurId}/coaching` - Create coaching (via système IA)
  ```json
  {
    "conseil": "Improve your CV presentation"
  }
  ```

---

## 9. Quiz - `/api/chercheur/{chercheurId}/quiz`

⚠️ **Note importante**: Les quiz sont générés par le système IA. Pas de controller CRUD séparé.

### Endpoints à tester
- `GET /api/chercheur/{chercheurId}/quiz`
- `POST /api/chercheur/{chercheurId}/quiz`

### Endpoints via ChercheurController
- **GET** `/api/chercheur/{chercheurId}/quiz` - Get all quizzes for a job seeker
- **POST** `/api/chercheur/{chercheurId}/quiz` - Create quiz (via système IA)
  ```json
  {
    "titre": "Java Basics Quiz"
  }
  ```

---

## 10. Gamification

⚠️ **Note importante**: La gamification est calculée dynamiquement par le système IA. Pas de CRUD, calculée à la volée basée sur les quiz et activités du chercheur.

### Type Values
- `INFO`
- `ALERT`
- `WARNING`

---

## 11. Utilisateur (User) - `/api/utilisateur`

### Endpoints à tester
- `GET /api/utilisateur`
- `GET /api/utilisateur/{id}`
- `POST /api/utilisateur`
- `PUT /api/utilisateur/{id}`
- `DELETE /api/utilisateur/{id}`

### CRUD Operations
- **GET** `/api/utilisateur` - Get all users
- **GET** `/api/utilisateur/{id}` - Get user by ID
- **POST** `/api/utilisateur` - Create user
- **PUT** `/api/utilisateur/{id}` - Update user
- **DELETE** `/api/utilisateur/{id}` - Delete user

---

## Testing with Postman

### Quick Test Sequence:

1. **Create Admin**
   - POST `http://localhost:9091/api/admin`
   - Body: `{"nom":"Admin","prenom":"Test","email":"admin@test.com","motDePasse":"pass"}`

2. **Create Recruiter**
   - POST `http://localhost:9091/api/recruteur`
   - Body: `{"nom":"Rec","prenom":"Test","email":"rec@test.com","motDePasse":"pass","role":"ROLE_RECRUTEUR"}`

3. **Create Job Seeker**
   - POST `http://localhost:9091/api/chercheur`
   - Body: `{"nom":"Seeker","prenom":"Test","email":"seeker@test.com","motDePasse":"pass","role":"ROLE_CANDIDAT"}`

4. **Create Job Offer**
   - POST `http://localhost:9091/api/offre`
   - Body: `{"titre":"Developer","description":"Java role","statut":"ACTIVE","recruteur":{"id":2}}`

5. **Create Application**
   - POST `http://localhost:9091/api/candidature/chercheur/3/offre/1`

6. **Get All Applications**
   - GET `http://localhost:9091/api/candidature`

---

## Common Issues Fixed

✅ All CRUD operations now properly save to database
✅ Circular reference issues resolved with `@JsonIgnore` annotations
✅ Update operations now properly merge existing entities
✅ Create operations properly persist new entities
✅ All endpoints return proper HTTP status codes
✅ GET chercheur - Fixed serialization issues
✅ UPDATE chercheur - Added proper update method
✅ UPDATE recruteur - Fixed with proper error handling
✅ CRUD formation - Complete controller and service methods added
✅ CRUD coaching - Complete controller and service methods added
✅ CREATE/UPDATE notification - Fixed to properly save to database
✅ CREATE candidature - Added POST endpoint with JSON body support
✅ Supprimé CRUD manuels pour Formation, Coaching, Notification - Seuls GET disponibles (générés par système IA)
✅ Quiz et Gamification - Gérés uniquement via système IA, pas de CRUD manuel

---

## Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success (delete)
- `404 Not Found` - Resource not found
- `400 Bad Request` - Invalid request
- `500 Internal Server Error` - Server error

