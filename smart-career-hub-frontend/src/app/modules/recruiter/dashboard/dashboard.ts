import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { RecruiterProfileService } from '../services/recruiter-profile.service';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class RecruiterDashboardComponent implements OnInit {
  sidebarActive = false;
  profileImage: string | null = null;

  constructor(
    private router: Router,
    private profileService: RecruiterProfileService
  ) { }

  ngOnInit() {
    this.profileService.profileImage$.subscribe(img => {
      this.profileImage = img;
    });
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
