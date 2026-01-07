# Documentation des Statistiques et Calculs (Recruteur)

Ce document explique comment chaque statistique affichée sur le tableau de bord et la page d'analyse du recruteur est calculée dans le système Smart Career Hub.

## 📊 Statistiques Dynamiques (Réelles)

Ces statistiques sont basées sur les données réelles de la base de données.

| Statistique | Source de Donnée | Logique de Calcul |
| :--- | :--- | :--- |
| **Offres Actives** | `OffreRepository` | Somme totale des offres liées à l'ID du recruteur. |
| **Total Candidatures** | `CandidatureRepository` | Somme totale des candidatures reçues pour toutes les offres du recruteur. |
| **Distribution par Statut** | `Candidature.statut` | Groupement des candidatures par leur état (`EN_ATTENTE`, `ACCEPTEE`, `REFUSEE`, etc.). |
| **Top Offres** | `Candidature` | Classement des offres ayant reçu le plus grand nombre de candidatures. |
| **Dernières Candidatures** | `Candidature.dateCandidature` | Liste les 5 candidatures les plus récentes basées sur l'horodatage ou l'ID. |
| **Score Matching IA (Moyenne)** | `Candidature.matchScore` | Moyenne arithmétique des scores de pertinence calculés par l'algorithme IA pour chaque candidat. |
| **Alertes de Fraude** | `ChercheurEmploi.fraudScore` | Compte des candidats ayant un score de fraude supérieur à 50 (détecté par le microservice AI). |
| **Temps écoulé (Time Ago)** | `dateCandidature` | Calcul de la durée entre la date de candidature et l'heure actuelle (ex: "2h", "5j"). |

| Taux de Conversion | `Candidature` | Ratio calculé si les vues sont disponibles (actuellement 0% car les vues ne sont pas encore traquées). |
| Qualité Moyenne (IA) | `Candidature.matchScore` | Moyenne des scores de pertinence pour une offre spécifique. |
| Délai de Recrutement | --- | Actuellement 0 (en attente de l'implémentation du suivi des dates d'embauche). |

---

## 🛡️ Système de Détection de Fraude

La détection de fraude repose sur le `fraudScore` envoyé par le microservice Python (AI). 
- **Score > 50** : Le système considère le profil comme "Suspect".
- **Action UI** : Une icône ⚠️ rouge apparaît sur le tableau de bord et une bannière d'alerte globale est affichée en haut de la page.

## 🤖 Algorithme de Matching (IA Simulation)

Le calcul du `matchScore` dans `RecruteurService` utilise une comparaison textuelle :
1. **Titre du Poste** : +20 points si le titre du candidat correspond à l'offre.
2. **Compétences** : Jusqu'à +30 points basés sur le ratio de mots-clés correspondants entre le CV et la description du poste.
3. **Score de Base** : 50 points de base pour tout profil qualifié.
