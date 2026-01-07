# Rapport de Correction et Gestion des Quotas Gemini

## 1. Problème Rencontré
L'API Gemini renvoyait des erreurs de type :
- **429 (Quota Exceeded)** : Le quota gratuit (RPM/RPD) était épuisé pour la clé précédente.
- **404 (Not Found)** : La nouvelle clé ne trouvait pas les modèles "standards" (`gemini-1.5-flash`, `gemini-pro`) car ils n'étaient pas activés ou disponibles pour ce projet spécifique.

## 2. Solution Appliquée
1. **Identification des modèles disponibles** :  
   Un script de diagnostic (`debug_models.py`) a été exécuté pour lister les modèles accessibles avec la clé actuelle.
2. **Changement de modèle** :  
   Le modèle `gemini-2.5-flash` a été identifié comme fonctionnel et disponible.
3. **Mise à jour de la configuration** :  
   Le fichier `app/config.py` a été modifié pour définir `gemini_model = "gemini-2.5-flash"`.

---

## 3. Comment vérifier vos quotas ?

Google ne fournit pas d'API simple pour obtenir "Combien de requêtes il me reste" en temps réel via le code. Cependant, voici comment surveiller votre consommation :

### Méthode 1 : Google Cloud Console (La plus précise)
1. Allez sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Sélectionnez votre projet API.
3. Allez dans **APIs & Services** > **Quotas**.
4. Filtrez par "Generative Language API".
   - Vous verrez vos limites (ex: 15 RPM - Requêtes par minute).
   - Vous verrez votre consommation actuelle.

### Méthode 2 : Logs d'erreur (Automatique)
Si vous dépassez le quota, l'API renverra une erreur avec le détail précis (comme nous l'avons vu dans les logs précédents) :
```json
"violations": [
  {
    "quota_metric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
    "quota_value": 0  <-- Signifie qu'il en reste 0
  }
]
```

### Méthode 3 : Script de Surveillance (Estimation)
Puisque nous stockons maintenant les logs dans MongoDB, vous pouvez faire une requête (dans Compass ou via un script) pour compter combien de requêtes ont été faites aujourd'hui :
```javascript
// Exemple de requête MongoDB pour compter les appels
db.ai_logs.countDocuments({
    "timestamp": { 
        $gte: new Date(new Date().setHours(0,0,0,0)) 
    }
})
```
*Note : Cela vous donne votre consommation, mais pas la limite restante.*
 