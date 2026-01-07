# How to Run Smart Career Hub Project

This guide explains how to set up and run the Smart Career Hub application, which consists of three main components:
- **Backend** (Spring Boot - Java)
- **Frontend** (Angular)
- **AI Microservice** (Python/Flask)

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

### Required Software
- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm 10+**
- **Python 3.8+** (for AI microservice)
- **PostgreSQL** (for backend database)
- **MongoDB** (for storing scraped job opportunities)

### Environment Setup
Make sure the following are configured:
- PostgreSQL database running on default port `5432`
- MongoDB running on default port `27017`
- Ports `9099` (backend), `4200` (frontend), and `5000` (AI service) are available

---

## 🚀 Running the Project

### **Step 1: Start the Backend (Spring Boot)**

The backend handles authentication, job management, user profiles, and web scraping.

#### Navigate to Backend Directory
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-carrer-hub-backend
```

#### Configure Database
1. Ensure PostgreSQL is running
2. Create a database named `smart_career_hub` (or update `application.properties`)
3. Update database credentials in `src/main/resources/application.properties` if needed

#### Run the Backend
```powershell
mvn clean install
mvn spring-boot:run
```

**Expected Output:**
- Backend will start on `http://localhost:9099`
- You should see: `Started SmartCareerHubBackendApplication`

**Common Issues:**
- If you get Lombok compilation errors, ensure you have the correct Java version (17)
- If database connection fails, verify PostgreSQL is running and credentials are correct

---

### **Step 2: Start the Frontend (Angular)**

The frontend provides the user interface for candidates, recruiters, and administrators.

#### Navigate to Frontend Directory
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-career-hub-frontend
```

#### Install Dependencies (First Time Only)
```powershell
npm install
```

#### Run the Frontend
```powershell
npm start
```
Or alternatively:
```powershell
ng serve
```

**Expected Output:**
- Frontend will start on `http://localhost:4200`
- You should see: `Angular Live Development Server is listening on localhost:4200`

**Access the Application:**
Open your browser and navigate to `http://localhost:4200`

---

### **Step 3: Start the AI Microservice (Optional)**

The AI microservice provides CV analysis, job matching, and fraud detection using Google Gemini AI.

#### Navigate to AI Microservice Directory
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
```

#### Set Up Python Virtual Environment (First Time Only)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Install Dependencies (First Time Only)
```powershell
pip install -r requirement.txt
```

#### Configure Environment Variables
Create or update the `.env` file with your Google Gemini API key:
```
GOOGLE_API_KEY=your_api_key_here
```

#### Run the AI Service
```powershell
python -m app.main
```

**Note:** Le service est déjà configuré pour utiliser le port **5000** par défaut dans `app/config.py`. Vous n'avez pas besoin de spécifier le port.

**Expected Output:**
- AI service will start on `http://localhost:5000`
- You should see: `INFO: Uvicorn running on http://0.0.0.0:5000`
- Swagger UI available at: `http://localhost:5000/docs`

---

## 🔄 Complete Startup Sequence

To run the entire application, follow these steps **in order**:

### **Terminal 1: Backend**
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-carrer-hub-backend
mvn spring-boot:run
```
Wait until you see "Started SmartCareerHubBackendApplication"

### **Terminal 2: Frontend**
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-career-hub-frontend
npm start
```
Wait until you see "Compiled successfully"

### **Terminal 3: AI Microservice (Optional)**
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
.\venv\Scripts\Activate.ps1
python -m app.main
```

---

## 🌐 Application URLs

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Main application interface |
| **Backend API** | http://localhost:9099 | REST API endpoints |
| **API Documentation** | http://localhost:9099/swagger-ui.html | Swagger API docs |
| **AI Microservice** | http://localhost:5000 | AI analysis endpoints |

---

## 👥 User Roles & Features

The application supports three user roles:

### **Candidate**
- Browse job opportunities
- Apply for positions
- Upload and manage CV
- View application status
- Access personalized dashboard

### **Recruiter**
- Post job offers
- Manage applications
- View candidate profiles
- Track recruitment metrics

### **Administrator**
- Manage users
- Monitor system statistics
- Handle fraud detection
- Oversee platform operations

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** `java.lang.ExceptionInInitializerError` with Lombok
```powershell
# Solution: Ensure Java 17 is being used
java -version
# Clean and rebuild
mvn clean install -DskipTests
```

**Problem:** Database connection refused
```powershell
# Check PostgreSQL is running
# Verify credentials in application.properties
```

### Frontend Issues

**Problem:** `npm install` fails
```powershell
# Clear cache and retry
npm cache clean --force
npm install
```

**Problem:** Port 4200 already in use
```powershell
# Kill the process or use a different port
ng serve --port 4201
```

### AI Microservice Issues

**Problem:** `ModuleNotFoundError`
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1
# Reinstall dependencies
pip install -r requirement.txt
```

**Problem:** Google API key not found
```
# Check .env file exists and contains:
GOOGLE_API_KEY=your_actual_key
```

---

## 📦 Building for Production

### Backend
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-carrer-hub-backend
mvn clean package
# JAR file will be in target/ directory
java -jar target/smart_career_hub_backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-career-hub-frontend
npm run build
# Production files will be in dist/ directory
```

---

## 🔐 Default Credentials

If you need to test with default users, check your database or create users through the registration page.

---

## 📝 Additional Notes

- **Job Scraping**: The backend automatically scrapes job opportunities from Tunisian job sites (TanitJobs, Emploitic, OptionCarriere) when the application starts
- **MongoDB**: Used to store scraped job opportunities
- **PostgreSQL**: Used for user data, applications, and job offers
- **Security**: JWT tokens are used for authentication with a 24-hour expiration

---

## 📞 Support

For issues or questions:
1. Check the conversation history for similar problems
2. Review error logs in the terminal
3. Verify all prerequisites are installed correctly
4. Ensure all required ports are available

---

## 🎯 Quick Start Checklist

- [ ] PostgreSQL database is running
- [ ] MongoDB is running
- [ ] Backend started successfully on port 9099
- [ ] Frontend started successfully on port 4200
- [ ] AI microservice started (optional) on port 5000
- [ ] Can access http://localhost:4200 in browser
- [ ] Can register/login as a user

---

**Last Updated:** January 7, 2026
