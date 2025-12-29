import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css',
})
export class CandidateHome {
  constructor(private router: Router) { }

  candidateName = 'Fatma';
  headline = 'Ingénieur Logiciel Junior · À l\'écoute d\'opportunités';

  // 2.1 Employability Score
  employability = {
    score: 82,
    level: 'Intermédiaire',
    recommendation: 'Pour atteindre le niveau "Avancé", concentrez-vous sur la maîtrise de la Conception Système et l\'Architecture Cloud (AWS/Azure).'
  };

  // 2.2 AI Recommended Jobs
  recommendedJobs = [
    {
      id: 1,
      title: 'Développeur Backend (Java/Spring)',
      company: 'Tech Solutions',
      location: 'Télétravail',
      contract: 'Temps Plein',
      matchScore: 95,
      postedTime: 'il y a 2 jours'
    },
    {
      id: 2,
      title: 'Ingénieur Full Stack',
      company: 'Global Innovators',
      location: 'Paris, France',
      contract: 'Hybride',
      matchScore: 88,
      postedTime: 'il y a 5 heures'
    },
    {
      id: 3,
      title: 'Dév Frontend Angular',
      company: 'Creative Agency',
      location: 'Tunis',
      contract: 'Freelance',
      matchScore: 82,
      postedTime: 'il y a 1 jour'
    }
  ];

  // 2.3 Gamification & Skills
  gamification = {
    level: 4,
    title: 'Guerrier du Code',
    currentXp: 850,
    nextLevelXp: 1000,
    skills: [
      { name: 'Java', progress: 75, color: 'bg-danger' },
      { name: 'Spring Boot', progress: 60, color: 'bg-success' },
      { name: 'Angular', progress: 50, color: 'bg-primary' },
      { name: 'SQL', progress: 80, color: 'bg-warning' }
    ]
  };

  // 2.4 My Applications Stats
  applicationStats = {
    pending: 3,
    inReview: 2,
    accepted: 1,
    rejected: 1
  };

  // 2.4 Recent Applications List
  recentApplications = [
    { title: 'Dév Java Junior', company: 'Orange Business', status: 'IN_REVIEW', date: '2024-05-18' },
    { title: 'Intégrateur Web', company: 'Vermeg', status: 'PENDING', date: '2024-05-20' }
  ];

  // 2.5 Recent Timeline
  timeline = [
    { type: 'QUIZ', title: 'Quiz Java Core terminé (+50 XP)', icon: 'fas fa-brain', color: 'text-warning', time: 'il y a 2 heures' },
    { type: 'JOB', title: 'Nouvelle Offre Recommandée : Dév Backend', icon: 'fas fa-briefcase', color: 'text-primary', time: 'il y a 1 jour' },
    { type: 'STATUS', title: 'Candidature "Orange" passée En Revue', icon: 'fas fa-check-circle', color: 'text-success', time: 'il y a 2 jours' }
  ];

  // 2.6 Recommended Trainings (Preview)
  recommendedTrainings = [
    { title: 'Sécurité Spring Avancée', provider: 'Udemy', focus: 'Backend' },
    { title: 'Docker pour Débutants', provider: 'Coursera', focus: 'DevOps' }
  ];

  // Actions
  viewRecommendations() {
    alert('Navigation vers les recommandations d\'offres...');
  }

  applyToJob(job: any) {
    alert(`Candidature envoyée pour ${job.title} chez ${job.company} !`);
  }

  playQuiz() {
    this.router.navigate(['/candidate/gamification']);
  }

  navigateToTrainings() {
    this.router.navigate(['/candidate/trainings']);
  }
}
