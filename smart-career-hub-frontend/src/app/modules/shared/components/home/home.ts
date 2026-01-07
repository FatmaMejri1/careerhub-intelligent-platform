import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  searchQuery = '';
  locationQuery = '';
  trendingJobs: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
    });
    this.fetchTrendingJobs();
  }

  fetchTrendingJobs(): void {
    this.http.get<any[]>('http://localhost:9099/api/offre').subscribe({
      next: (offres) => {
        // Sort by date and take last 4 active
        this.trendingJobs = offres
          .filter(o => o.statut === 'ACTIVE' || !o.statut)
          .slice(-4)
          .reverse()
          .map(o => ({
            id: o.id,
            title: o.titre,
            company: o.recruteur?.nomEntreprise || 'Smart Hub',
            location: o.location || 'Tunis, Tunisie',
            type: o.type || 'CDI',
            match: 85 + Math.floor(Math.random() * 15) // Dynamic match flair
          }));

        if (this.trendingJobs.length === 0) {
          this.trendingJobs = this.fallbackJobs;
        }
      },
      error: () => {
        this.trendingJobs = this.fallbackJobs;
      }
    });
  }

  private fallbackJobs = [
    { title: 'Full Stack Dev', company: 'TechCorp', location: 'Tunis', type: 'CDI', match: 92 },
    { title: 'Data Scientist', company: 'DataLab', location: 'Remote', type: 'CDI', match: 85 },
    { title: 'UX Designer', company: 'DesignStudio', location: 'Lyon', type: 'CDI', match: 78 },
    { title: 'Product Manager', company: 'InnovateCo', location: 'Bordeaux', type: 'CDI', match: 90 }
  ];

  // Propriétés publiques accessibles dans le template
  public features = [
    {
      icon: 'bi-briefcase',
      title: 'Offres d\'emploi',
      description: 'Accédez à des milliers d\'opportunités'
    },
    {
      icon: 'bi-building',
      title: 'Clubs & Organisations',
      description: 'Rejoignez des communautés professionnelles'
    },
    {
      icon: 'bi-mortarboard',
      title: 'Stages',
      description: 'Trouvez le stage qui correspond à votre profil'
    },
    {
      icon: 'bi-people',
      title: 'Networking',
      description: 'Élargissez votre réseau professionnel'
    }
  ];

  public testimonials = [
    {
      name: 'Marie L.',
      role: 'Développeuse Web',
      text: 'J\'ai trouvé mon emploi idéal en moins de 2 semaines !'
    },
    {
      name: 'Pierre D.',
      role: 'Data Analyst',
      text: 'Les recommandations IA sont incroyablement pertinentes.'
    },
    {
      name: 'Sophie M.',
      role: 'RH Manager',
      text: 'Nous avons réduit notre temps de recrutement de 40%.'
    }
  ];

  // Méthode publique accessible dans le template
  public getInitial(name: string): string {
    return name.charAt(0);
  }

  // Méthodes pour les actions authentifiées
  applyToJob(job: any): void {
    if (this.isAuthenticated) {
      // TODO: Implémenter la logique de candidature
      console.log('Postuler à:', job);
      alert(`Candidature envoyée pour ${job.title} chez ${job.company}`);
    }
  }

  startCoaching(): void {
    if (this.isAuthenticated) {
      // TODO: Rediriger vers la page de coaching
      console.log('Démarrer le coaching');
      alert('Redirection vers le coaching...');
    }
  }

  exploreOpportunities(): void {
    if (this.isAuthenticated) {
      // Scroll vers la section trending
      const element = document.getElementById('trending');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  searchJobs(): void {
    if (this.searchQuery || this.locationQuery) {
      this.router.navigate(['/opportunities'], {
        queryParams: {
          q: this.searchQuery,
          l: this.locationQuery
        }
      });
    } else {
      this.router.navigate(['/opportunities']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
