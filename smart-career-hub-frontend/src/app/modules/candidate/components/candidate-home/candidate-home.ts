import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidateDataService } from '../../services/candidate-data.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css',
})
export class CandidateHome implements OnInit {
  constructor(
    private router: Router,
    private candidateDataService: CandidateDataService,
    private authService: AuthService
  ) { }

  candidateName = 'Candidat';
  headline = 'À l\'écoute d\'opportunités';
  fraudScore = 0;
  bestQuizScore = 0;

  // 2.1 Employability Score
  employability = {
    score: 0,
    level: 'Débutant',
    recommendation: 'Complétez votre profil pour améliorer votre score d\'employabilité.'
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
    level: 1,
    title: 'Débutant',
    currentXp: 0,
    nextLevelXp: 1000,
    skills: [] as any[]
  };

  // 2.4 My Applications Stats
  applicationStats = {
    pending: 0,
    inReview: 0,
    accepted: 0,
    rejected: 0
  };

  // 2.4 Recent Applications List
  recentApplications: any[] = [];

  // 2.5 Recent Timeline
  timeline: any[] = [];

  // 2.6 Recommended Trainings (Preview)
  recommendedTrainings = [
    { title: 'Sécurité Spring Avancée', provider: 'Udemy', focus: 'Backend' },
    { title: 'Docker pour Débutants', provider: 'Coursera', focus: 'DevOps' }
  ];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load profile data
    this.candidateDataService.getProfile().subscribe({
      next: (data) => {
        if (data) {
          this.candidateName = data.prenom || 'Candidat';
          this.headline = data.titre || 'À l\'écoute d\'opportunités';

          // Calculate employability score
          this.calculateEmployabilityScore(data);

          // Load skills
          this.loadSkills(data);

          // Load gamification data
          this.loadGamificationData(data);
        }
      },
      error: (err) => console.error('Error loading profile', err)
    });

    // Load application stats and recent activity from Backend
    this.candidateDataService.getDashboardStats().subscribe({
      next: (stats) => {
        if (stats) {
          this.applicationStats = {
            pending: stats.applicationStatusDistribution?.EN_ATTENTE || 0,
            inReview: stats.applicationStatusDistribution?.A_L_EXAMEN || 0,
            accepted: stats.applicationStatusDistribution?.ACCEPTEE || 0,
            rejected: stats.applicationStatusDistribution?.REFUSEE || 0
          };

          // Update Employability and other scores from real backend data
          this.employability.score = stats.employabilityScore || 0;
          this.fraudScore = stats.fraudScore || 0;
          this.bestQuizScore = stats.bestQuizScore || 0;

          this.updateEmployabilityLevel(this.employability.score);

          this.recentApplications = (stats.recentApplications || []).map((app: any) => ({
            ...app,
            status: this.formatStatus(app.status)
          }));

          this.recommendedJobs = (stats.recommendedJobs || []).map((job: any) => ({
            ...job,
            contract: job.type || 'Temps Plein',
            postedTime: job.date || 'Récemment'
          }));

          // Building timeline after data is loaded
          this.buildTimeline();
        }
      },
      error: (err) => {
        console.error('Error loading stats', err);
        // Build timeline even if stats fail
        this.buildTimeline();
      }
    });
  }

  private formatStatus(status: string): string {
    const map: any = {
      'EN_ATTENTE': 'En attente',
      'A_L_EXAMEN': 'En examen',
      'ACCEPTEE': 'Acceptée',
      'REFUSEE': 'Refusée'
    };
    return map[status] || status;
  }

  calculateEmployabilityScore(profileData: any) {
    let score = 0;

    // Basic info (20 points)
    if (profileData.prenom && profileData.nom) score += 5;
    if (profileData.telephone) score += 5;
    if (profileData.adresse) score += 5;
    if (profileData.photoUrl) score += 5;

    // Professional info (30 points)
    if (profileData.titre) score += 10;
    if (profileData.objectif) score += 10;
    if (profileData.cvUrl) score += 10;

    // Skills & Experience (50 points)
    const skills = this.parseJson(profileData.competences);
    const experiences = this.parseJson(profileData.experiences);
    const educations = this.parseJson(profileData.educations);
    const projects = this.parseJson(profileData.projects);

    if (skills.length > 0) score += 15;
    if (experiences.length > 0) score += 15;
    if (educations.length > 0) score += 10;
    if (projects.length > 0) score += 10;

    this.employability.score = Math.min(score, 100);
    this.updateEmployabilityLevel(this.employability.score);
  }

  updateEmployabilityLevel(score: number) {
    // Determine level
    if (score >= 80) {
      this.employability.level = 'Avancé';
      this.employability.recommendation = 'Excellent profil! Continuez à postuler aux meilleures opportunités.';
    } else if (score >= 50) {
      this.employability.level = 'Intermédiaire';
      this.employability.recommendation = 'Bon profil. Ajoutez plus de projets et certifications pour atteindre le niveau Avancé.';
    } else {
      this.employability.level = 'Débutant';
      this.employability.recommendation = 'Complétez votre profil avec vos expériences, compétences et projets.';
    }
  }

  loadSkills(profileData: any) {
    const skills = this.parseJson(profileData.competences);

    if (skills.length > 0) {
      // Take first 4 skills and assign random progress for demo
      this.gamification.skills = skills.slice(0, 4).map((skill: string, index: number) => ({
        name: skill,
        progress: 60 + (index * 5), // Demo progress
        color: ['bg-danger', 'bg-success', 'bg-primary', 'bg-warning'][index % 4]
      }));
    }
  }

  loadGamificationData(profileData: any) {
    // Calculate level based on profile completion
    const completionScore = this.employability.score;

    if (completionScore >= 80) {
      this.gamification.level = 5;
      this.gamification.title = 'Élite du Marché';
      this.gamification.currentXp = completionScore * 10;
      this.gamification.nextLevelXp = 1000;
    } else if (completionScore >= 60) {
      this.gamification.level = 4;
      this.gamification.title = 'Talent Confirmé';
      this.gamification.currentXp = completionScore * 10;
      this.gamification.nextLevelXp = 800;
    } else if (completionScore >= 40) {
      this.gamification.level = 3;
      this.gamification.title = 'Professionnel Actif';
      this.gamification.currentXp = completionScore * 10;
      this.gamification.nextLevelXp = 600;
    } else if (completionScore >= 20) {
      this.gamification.level = 2;
      this.gamification.title = 'Potentiel Émergent';
      this.gamification.currentXp = completionScore * 10;
      this.gamification.nextLevelXp = 400;
    } else {
      this.gamification.level = 1;
      this.gamification.title = 'Profil en Devenir';
      this.gamification.currentXp = completionScore * 10;
      this.gamification.nextLevelXp = 200;
    }
  }

  loadApplicationStats() {
    // For now, use localStorage (later can be replaced with API call)
    const applications = localStorage.getItem('user_applications');
    if (applications) {
      const apps = JSON.parse(applications);
      this.applicationStats = {
        pending: apps.filter((a: any) => a.status === 'PENDING').length,
        inReview: apps.filter((a: any) => a.status === 'IN_REVIEW').length,
        accepted: apps.filter((a: any) => a.status === 'ACCEPTED').length,
        rejected: apps.filter((a: any) => a.status === 'REJECTED').length
      };

      // Get recent 2 applications
      this.recentApplications = apps.slice(0, 2);
    }
  }

  buildTimeline() {
    this.timeline = [];

    // Add profile completion event
    if (this.employability.score > 50) {
      this.timeline.push({
        type: 'PROFILE',
        title: 'Profil complété à ' + this.employability.score + '%',
        icon: 'fas fa-user-check',
        color: 'text-success',
        time: 'Aujourd\'hui'
      });
    }

    // Add recent applications to timeline
    this.recentApplications.forEach(app => {
      this.timeline.push({
        type: 'APPLICATION',
        title: 'Candidature envoyée: ' + app.title,
        icon: 'fas fa-paper-plane',
        color: 'text-primary',
        time: app.date || 'Récemment'
      });

      if (app.quizScore) {
        this.timeline.push({
          type: 'QUIZ',
          title: `Quiz Réussi: ${app.title} (${app.quizScore.toFixed(0)}%)`,
          icon: 'fas fa-trophy',
          color: 'text-warning',
          time: app.date || 'Récemment'
        });
      }
    });

    // Add job recommendation
    this.timeline.push({
      type: 'JOB',
      title: 'Nouvelle Offre Recommandée : ' + this.recommendedJobs[0].title,
      icon: 'fas fa-briefcase',
      color: 'text-warning',
      time: 'il y a 2 heures'
    });
  }

  parseJson(str: string): any[] {
    if (!str || str === 'null') return [];
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  }

  // Actions
  viewRecommendations() {
    this.router.navigate(['/opportunities']);
  }

  applyToJob(job: any) {
    if (confirm(`Voulez-vous postuler pour le poste de ${job.title} chez ${job.company} ?`)) {
      this.candidateDataService.submitApplication(job.id).subscribe({
        next: () => {
          alert(`Félicitations ! Votre candidature pour ${job.title} a été envoyée.`);
          this.loadDashboardData(); // Refresh stats
        },
        error: (err) => {
          console.error('Apply error', err);
          alert('Erreur lors de l\'envoi de la candidature.');
        }
      });
    }
  }

  playQuiz() {
    this.router.navigate(['/opportunities']);
  }

  navigateToTrainings() {
    this.router.navigate(['/candidate/trainings']);
  }
}
