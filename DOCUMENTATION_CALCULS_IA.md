# Documentation des Calculs IA & Algorithmiques - Smart Career Hub

Ce document détaille tous les mécanismes de calcul utilisés dans la plateforme pour évaluer les candidats, faire correspondre les offres d'emploi et détecter les fraudes.

---

## 1. Score d'Employabilité (AI Employability Score)
**But :** Mesurer la qualité et la complétude du profil d'un candidat pour déterminer ses chances d'être recruté.

*   **Chemin de travail :** 
    *   Backend : `com.smarthub.smart_career_hub_backend.service.ScoreService.calculateEmployability`
    *   Frontend (Preview) : `candidate-home.ts -> calculateEmployabilityScore`
*   **Fonctionnement (Pondération sur 100) :**
    1.  **Complétude du Profil (50 pts) :**
        *   Infos de base (Nom, Prénom, Titre, Objectif, Photo) : **+25 pts**
        *   Sections techniques (Compétences, Expériences, Éducations) : **+25 pts**
    2.  **Validation Technique (50 pts) :**
        *   Basé sur la **meilleure note obtenue aux Quiz IA**. Si un candidat obtient 100% à un quiz, il gagne les 50 points restants.
*   **Résultat :** Un score sur 100 affiché sur le Dashboard.

---

## 2. Score de Matching (Dynamic Match Score)
**But :** Evaluer la pertinence d'un candidat pour une offre d'emploi spécifique.

*   **Chemin de travail :** 
    *   Backend : `com.smarthub.smart_career_hub_backend.service.StatsService.calculateMatchScore`
*   **Fonctionnement (Pondération sur 99) :**
    1.  **Socle de Confiance (50 pts) :** Score de base minimal pour tout candidat.
    2.  **Matching Sémantique du Titre (+25 pts) :** Comparaison entre le titre de l'offre et le titre du candidat (ex: "Java" vs "Java Developer").
    3.  **Analyse des Compétences (+25 pts) :** Extraction des mots-clés techniques de la description de l'offre et comparaison avec les compétences déclarées par le candidat.
*   **Résultat :** Un pourcentage de match (ex: 87% Match) utilisé pour les recommandations.

---

## 3. Indice de Fiabilité (Fraud / Reliability Score)
**But :** Détecter les profils suspects ou les données falsifiées pour protéger les recruteurs.

*   **Chemin de travail :** 
    *   Backend (Heuristique) : `com.smarthub.smart_career_hub_backend.service.ScoreService.calculateFraudScore`
    *   Microservice AI (Deep Analysis) : `/api/fraud/analyze` (via `AIService.java`)
*   **Fonctionnement :**
    1.  **Vérification des liens (Heuristique) :** Analyse des liens de certifications. Si un lien est invalide ou manquant pour une certification déclarée : **+20 pts de fraude**.
    2.  **Analyse des noms :** Détection de mots-clés suspects comme "Test", "Fake" ou des noms d'entreprises trop courts.
    3.  **Analyse IA (Deep learning) :** Le microservice Python compare la cohérence entre les expériences et les dates pour détecter des chevauchements impossibles.
*   **Résultat :** Un score où **0** est totalement fiable et **100** est hautement suspect.

---

## 4. Gamification (XP & Levels)
**But :** Encourager l'utilisateur à améliorer son profil et à passer des tests.

*   **Chemin de travail :** 
    *   Frontend : `candidate-home.ts -> loadGamificationData`
*   **Fonctionnement :**
    *   **XP :** Directement lié au score d'employabilité (`Score * 10`).
    *   **Niveaux :** 5 paliers basés sur l'avancement :
        1. **Profil en Devenir** (<20%)
        2. **Potentiel Émergent** (20-40%)
        3. **Professionnel Actif** (40-60%)
        4. **Talent Confirmé** (60-80%)
        5. **Élite du Marché** (>80%)
*   **Résultat :** Titres honorifiques et progression visuelle.

---

## 5. Recommandations AI (Job & Training)
**But :** Proposer les meilleurs contenus selon le profil.

*   **Chemin de travail :** 
    *   Jobs : `StatsService.getCandidateStats`
    *   Formations : `TrainingsComponent.ts`
*   **Fonctionnement :**
    *   Utilise le **Score de Matching** pour trier toutes les offres de la base de données et ne présenter que le TOP 3 au candidat sur son dashboard.
*   **Résultat :** Flux dynamique d'opportunités personnalisées.

---
*Généré automatiquement par le système Smart Career Hub - Janvier 2026*
