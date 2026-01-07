# 🔧 Fix: AI Microservice Integration Error

**Date:** 2026-01-07  
**Problème:** Erreur 500 lors des appels aux endpoints AI  
**Statut:** ✅ RÉSOLU

---

## 🐛 Problème Identifié

### **Symptômes:**
- ❌ `POST http://localhost:9099/api/analysis/recommend-profile` → 500 Error
- ❌ `POST http://localhost:9099/api/analysis/cv` → 500 Error
- ❌ Frontend ne peut pas obtenir les recommandations AI
- ❌ Analyse de CV échoue

### **Erreurs dans la Console:**
```
trainings.ts:73   POST http://localhost:9099/api/analysis/recommend-profile 500 (Internal Server Error)
cv-manager.ts:156 POST http://localhost:9099/api/analysis/cv 500 (Internal Server Error)
```

---

## 🔍 Cause Racine

Le service `AIService.java` dans le backend Spring Boot était configuré pour appeler le microservice AI sur le **mauvais port**.

**Configuration Incorrecte:**
```java
// AIService.java - ligne 33
this.webClient = webClientBuilder
    .baseUrl("http://127.0.0.1:8000")  // ❌ MAUVAIS PORT!
    .clientConnector(new ReactorClientHttpConnector(httpClient))
    .build();
```

**Réalité:**
- Le microservice AI tourne sur le port **5000** (FastAPI)
- Le backend essayait de se connecter au port **8000** (qui n'existe pas)
- Résultat: Connection refused → 500 Internal Server Error

---

## ✅ Solution Appliquée

### **Modification du Code**

**Fichier:** `smart-carrer-hub-backend/src/main/java/com/smarthub/smart_career_hub_backend/service/AIService.java`

**Changement:**
```java
// Ligne 33 - AVANT
.baseUrl("http://127.0.0.1:8000")

// Ligne 33 - APRÈS
.baseUrl("http://localhost:5000")  // ✅ PORT CORRECT!
```

---

## 🔄 Étapes pour Appliquer le Fix

### **Option 1: Redémarrage Automatique (Si Spring Boot DevTools est activé)**
Le backend devrait se recharger automatiquement.

### **Option 2: Redémarrage Manuel**

1. **Arrêter le backend actuel:**
   - Dans le terminal où `mvn spring-boot:run` tourne
   - Appuyez sur `Ctrl+C`

2. **Redémarrer le backend:**
   ```bash
   cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\smart-carrer-hub-backend
   mvn spring-boot:run
   ```

3. **Attendre le message:**
   ```
   Started SmartCarrerHubApplication in X seconds
   ```

---

## 🧪 Vérification du Fix

### **Test 1: Vérifier que le microservice AI est accessible**
```bash
curl http://localhost:5000/api/health
```
**Résultat attendu:** `{"status": "healthy", ...}`

### **Test 2: Tester depuis le frontend**
1. Aller sur http://localhost:4200/candidate/trainings
2. La page devrait charger les recommandations AI automatiquement
3. Vérifier qu'il n'y a plus d'erreur 500 dans la console

### **Test 3: Tester l'analyse de CV**
1. Aller sur http://localhost:4200/candidate/cv-manager
2. Uploader un CV
3. Cliquer sur "Analyser"
4. L'analyse devrait fonctionner sans erreur

---

## 📊 Architecture de Communication

```
┌─────────────────┐
│   Frontend      │
│  Angular :4200  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Backend       │
│ Spring Boot     │
│    :9099        │
└────────┬────────┘
         │ HTTP (WebClient)
         │ http://localhost:5000
         ▼
┌─────────────────┐
│ AI Microservice │
│  FastAPI :5000  │
└─────────────────┘
```

---

## 🎯 Endpoints Affectés (Maintenant Corrigés)

| Frontend Appelle | Backend Proxy | AI Microservice |
|------------------|---------------|-----------------|
| `POST /api/analysis/cv` | `POST :9099/api/analysis/cv` | `POST :5000/api/analysis/cv` |
| `POST /api/analysis/recommend-profile` | `POST :9099/api/analysis/recommend-profile` | `POST :5000/api/analysis/recommend-profile` |
| `POST /api/analysis/generate` | `POST :9099/api/analysis/generate` | `POST :5000/api/analysis/generate` |
| `POST /api/quiz/generate` | `POST :9099/api/quiz/generate` | `POST :5000/api/quiz/generate` |
| `POST /api/fraud/analyze` | `POST :9099/api/fraud/analyze` | `POST :5000/api/fraud/analyze` |

---

## 🔐 Configuration des Ports

Pour référence future, voici les ports utilisés par chaque service:

| Service | Port | URL |
|---------|------|-----|
| Frontend (Angular) | 4200 | http://localhost:4200 |
| Backend (Spring Boot) | 9099 | http://localhost:9099 |
| AI Microservice (FastAPI) | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 |
| MongoDB | 27017 | localhost:27017 |

---

## 📝 Notes Importantes

### **Pourquoi le Backend Fait un Proxy?**
Le frontend Angular appelle le backend Spring Boot, qui ensuite appelle le microservice AI. Cette architecture permet:
- ✅ Centralisation de la sécurité (JWT, CORS)
- ✅ Gestion unifiée des erreurs
- ✅ Logging et monitoring centralisés
- ✅ Éviter les problèmes CORS entre frontend et AI service

### **Configuration CORS**
Le microservice AI accepte les requêtes de n'importe quelle origine (`allow_origins=["*"]`), mais en production, il faudrait restreindre cela à:
```python
allow_origins=["http://localhost:9099"]  # Seulement le backend
```

---

## 🚀 Après le Fix

Une fois le backend redémarré avec la bonne configuration:

✅ Les recommandations AI s'afficheront automatiquement sur `/candidate/trainings`  
✅ L'analyse de CV fonctionnera sur `/candidate/cv-manager`  
✅ La génération de quiz fonctionnera  
✅ La détection de fraude fonctionnera  

---

## 🔍 Debugging Futur

Si des erreurs similaires se produisent à l'avenir:

1. **Vérifier les ports:**
   ```bash
   netstat -ano | findstr :5000  # Windows
   netstat -an | grep :5000      # Linux/Mac
   ```

2. **Vérifier les logs du backend:**
   - Chercher "Error in AIService"
   - Vérifier les messages de connexion

3. **Tester directement le microservice AI:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Vérifier la configuration:**
   - `AIService.java` → baseUrl doit être `http://localhost:5000`
   - `app/main.py` → doit tourner sur port 5000
   - `app/config.py` → `api_port = 5000`

---

**Fix Appliqué Par:** Antigravity AI Assistant  
**Date:** 2026-01-07 11:50  
**Statut:** ✅ RÉSOLU - Redémarrage du backend requis
