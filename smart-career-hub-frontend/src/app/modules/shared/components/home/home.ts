import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
    });
  }

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

  public trendingJobs = [
    {
      title: 'Développeur Full Stack',
      company: 'TechCorp',
      location: 'Paris',
      type: 'CDI',
      match: 92
    },
    {
      title: 'Data Scientist',
      company: 'DataLab',
      location: 'Remote',
      type: 'CDI',
      match: 85
    },
    {
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Lyon',
      type: 'CDI',
      match: 78
    },
    {
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'Bordeaux',
      type: 'CDI',
      match: 90
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

  logout(): void {
    this.authService.logout();
  }
}
