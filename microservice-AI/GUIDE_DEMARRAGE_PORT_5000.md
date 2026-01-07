# 🚀 Guide de Démarrage du Microservice AI

## ✅ Configuration Actuelle

Le microservice AI est **déjà configuré** pour tourner sur le port **5000** par défaut.

**Fichier de configuration:** `microservice-AI/app/config.py`
```python
api_port: int = 5000  # Port par défaut
```

---

## 🎯 Commandes pour Lancer le Microservice AI

### **Méthode 1: Commande Standard (Recommandée)**

```bash
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
.\venv\Scripts\Activate.ps1
python -m app.main
```

Cette commande utilise automatiquement le port **5000** défini dans `config.py`.

---

### **Méthode 2: Avec Uvicorn Directement**

```bash
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

**Options:**
- `--host 0.0.0.0` : Accepte les connexions de toutes les interfaces
- `--port 5000` : Spécifie explicitement le port 5000
- `--reload` : Redémarre automatiquement lors des changements de code (développement)

---

### **Méthode 3: Avec Variable d'Environnement**

```bash
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
.\venv\Scripts\Activate.ps1
$env:API_PORT=5000
python -m app.main
```

---

## 📝 Configuration du Port

### **Option 1: Modifier le Fichier .env**

Créez ou modifiez le fichier `.env` dans `microservice-AI/`:

```env
# .env
API_PORT=5000
API_HOST=0.0.0.0
DEBUG=False
GOOGLE_API_KEY=votre_clé_api
```

### **Option 2: Modifier config.py**

Le fichier `app/config.py` contient déjà la bonne configuration:

```python
class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 5000  # ✅ Déjà configuré sur 5000
```

---

## 🔍 Vérifier que le Service Tourne sur le Port 5000

### **Test 1: Vérifier le Port**

```bash
# Windows PowerShell
netstat -ano | findstr :5000
```

**Résultat attendu:**
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
```

### **Test 2: Tester l'Endpoint Health**

```bash
curl http://localhost:5000/api/health
```

**Résultat attendu:**
```json
{
  "status": "healthy",
  "service": "Smart Career AI",
  "timestamp": "...",
  "memory_usage": 2.5,
  "cpu_usage": 5.0
}
```

### **Test 3: Ouvrir la Documentation**

Ouvrez dans votre navigateur:
- **Swagger UI:** http://localhost:5000/docs
- **ReDoc:** http://localhost:5000/redoc

---

## 🎯 Commande Recommandée pour Votre Projet

**La commande que vous utilisez actuellement est correcte:**

```bash
python -m app.main
```

✅ Cette commande:
- Lit automatiquement `config.py`
- Utilise le port **5000** par défaut
- Charge les variables d'environnement depuis `.env`
- Lance le serveur avec Uvicorn

**Vous n'avez PAS besoin de spécifier `--port 5000`** car c'est déjà la valeur par défaut !

---

## 📋 Workflow Complet de Démarrage

### **Démarrage Initial (Première Fois)**

```bash
# 1. Aller dans le répertoire
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI

# 2. Créer l'environnement virtuel (si pas déjà fait)
python -m venv venv

# 3. Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# 4. Installer les dépendances (si pas déjà fait)
pip install -r requirement.txt

# 5. Vérifier que .env existe avec GOOGLE_API_KEY
type .env

# 6. Lancer le service
python -m app.main
```

### **Démarrage Quotidien**

```bash
# 1. Aller dans le répertoire
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI

# 2. Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# 3. Lancer le service
python -m app.main
```

---

## 🔧 Modes de Démarrage

### **Mode Production (Actuel)**

```bash
python -m app.main
```
- ✅ Pas de rechargement automatique
- ✅ Optimisé pour la performance
- ✅ Port 5000 par défaut

### **Mode Développement (Avec Auto-Reload)**

```bash
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```
- ✅ Rechargement automatique lors des modifications
- ✅ Utile pendant le développement
- ✅ Port 5000 explicite

### **Mode Debug**

Modifiez `config.py`:
```python
debug: bool = True  # Activer le mode debug
```

Puis lancez:
```bash
python -m app.main
```

---

## 🌐 URLs du Service

Une fois le service démarré sur le port 5000:

| Ressource | URL |
|-----------|-----|
| **API Base** | http://localhost:5000 |
| **Health Check** | http://localhost:5000/api/health |
| **Swagger UI** | http://localhost:5000/docs |
| **ReDoc** | http://localhost:5000/redoc |
| **OpenAPI Schema** | http://localhost:5000/openapi.json |

---

## 🔗 Intégration avec le Backend

Le backend Spring Boot est maintenant configuré pour appeler le microservice AI sur le port 5000:

**Fichier:** `AIService.java`
```java
this.webClient = webClientBuilder
    .baseUrl("http://localhost:5000")  // ✅ Port correct
    .build();
```

**Flux de communication:**
```
Frontend (Angular :4200)
    ↓ HTTP
Backend (Spring Boot :9099)
    ↓ HTTP WebClient
AI Microservice (FastAPI :5000)
```

---

## 📊 Vérification de l'État

### **Script de Vérification Rapide**

```bash
cd c:\Users\fatma\OneDrive\Bureau\smart-carrer\microservice-AI
python quick_status.py
```

**Sortie attendue:**
```
======================================================================
  🤖 AI MICROSERVICE - QUICK STATUS CHECK
======================================================================

✅ Status: HEALTHY
✅ Service: Smart Career AI
✅ Memory: 2.79%
✅ CPU: 17.00%

📚 Documentation: http://localhost:5000/docs
📊 Health Check: http://localhost:5000/api/health

======================================================================
  ✅ AI MICROSERVICE IS FULLY OPERATIONAL
======================================================================
```

---

## 🎯 Résumé

### **Commande à Utiliser:**

```bash
python -m app.main
```

**Cette commande:**
- ✅ Utilise automatiquement le port **5000**
- ✅ Lit la configuration depuis `config.py`
- ✅ Charge les variables d'environnement depuis `.env`
- ✅ Lance le serveur FastAPI avec Uvicorn
- ✅ Est la méthode recommandée

### **Vous N'AVEZ PAS BESOIN de:**
- ❌ `--port 5000` (déjà configuré par défaut)
- ❌ `--host 0.0.0.0` (déjà configuré par défaut)
- ❌ Modifier quoi que ce soit

**Le service est déjà parfaitement configuré pour le port 5000 !** 🎉

---

## 📝 Fichiers de Configuration

### **config.py (Configuration Principale)**
```python
api_host: str = "0.0.0.0"  # Écoute sur toutes les interfaces
api_port: int = 5000       # Port par défaut
```

### **.env (Variables d'Environnement)**
```env
GOOGLE_API_KEY=votre_clé_api_google
API_PORT=5000              # Optionnel (déjà par défaut)
API_HOST=0.0.0.0          # Optionnel (déjà par défaut)
```

### **main.py (Point d'Entrée)**
```python
if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,    # Utilise config.py
        port=settings.api_port,    # Utilise config.py (5000)
        reload=settings.debug,
        log_level="info"
    )
```

---

**Créé le:** 2026-01-07  
**Statut:** ✅ Configuration Validée  
**Port:** 5000 (Par Défaut)
