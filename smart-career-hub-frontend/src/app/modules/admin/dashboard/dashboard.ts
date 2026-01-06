import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  profileImage: string | null = null;
  user: User | null = null;
  adminDetails: any = null;

  constructor(
    private router: Router,
    private profileService: AdminProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    // Subscribe to image changes
    this.profileService.profileImage$.subscribe(img => {
      this.profileImage = img;
    });

    // Load admin profile
    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.adminDetails = profile;
        if (profile.profileImage) {
          this.profileService.updateProfileImage(profile.profileImage);
        }
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  disconnect() {
    this.authService.logout();
  }
}
