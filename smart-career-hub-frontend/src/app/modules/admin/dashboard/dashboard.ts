import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header';
import { AdminProfileService } from '../services/admin-profile.service';
import { AuthService, User } from '../../shared/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  sidebarActive = false;
  profileImage$: Observable<string | null>;
  user: User | null = null;
  adminDetails: any = null;

  constructor(
    private router: Router,
    private profileService: AdminProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.profileImage$ = this.profileService.profileImage$;
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    // Use setTimeout to move the subscription to the next tick, avoiding NG0100
    setTimeout(() => {
      this.profileService.getProfile().subscribe(profile => {
        if (profile) {
          this.adminDetails = profile;
          if (profile.profileImage) {
            this.profileService.updateProfileImage(profile.profileImage);
          }
          if (this.cdr) {
            this.cdr.markForCheck();
          }
        }
      });
    });
  }

  onSidebarFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileService.uploadPhoto(file).subscribe({
        next: (response) => {
          if (response && response.url) {
            const fullUrl = `http://localhost:9099${response.url}`;
            this.profileService.updateProfileImage(fullUrl);
            // Refresh admin details to sync other parts
            this.profileService.getProfile().subscribe(p => this.adminDetails = p);
          }
        },
        error: (err) => {
          console.error('Error uploading photo from sidebar', err);
          alert('Erreur lors du téléchargement de la photo.');
        }
      });
    }
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  disconnect() {
    this.authService.logout();
  }
}
