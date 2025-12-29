import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { CandidateDataService } from '../services/candidate-data.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class CandidateDashboardComponent {
  sidebarActive = false;
  userPhoto$;

  constructor(
    private candidateDataService: CandidateDataService,
    private router: Router
  ) {
    this.userPhoto$ = this.candidateDataService.userPhoto$;
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = e.target?.result || null;
        this.candidateDataService.updatePhoto(photo);
      };
      reader.readAsDataURL(file);
    }
  }

  disconnect() {
    this.router.navigate(['/auth/login']);
  }
}
