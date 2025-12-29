import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { AdminProfileService } from '../services/admin-profile.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  sidebarActive = false;
  profileImage: string | null = null; // Add property for profile image

  constructor(
    private router: Router,
    private profileService: AdminProfileService
  ) { }

  ngOnInit() {
    // Subscribe to image changes
    this.profileService.profileImage$.subscribe(img => {
      this.profileImage = img;
    });
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  disconnect() {
    this.router.navigate(['/auth/login']);
  }
}
