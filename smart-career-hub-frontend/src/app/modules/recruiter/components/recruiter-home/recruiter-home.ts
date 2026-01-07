import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterService, RecruiterStats } from '../../services/recruiter.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
    selector: 'app-recruiter-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recruiter-home.html',
    styleUrls: ['./recruiter-home.css']
})
export class RecruiterHomeComponent implements OnInit {
    stats?: RecruiterStats;
    recentApplications: any[] = [];
    recommendations: any[] = [];

    constructor(
        private recruiterService: RecruiterService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                const userId = Number(user.id);

                this.recruiterService.getStatsByRecruiterId(userId).subscribe({
                    next: (data) => {
                        this.stats = data;
                        this.recentApplications = data.recentApplications || [];
                    },
                    error: (err) => {
                        console.error('Error loading dashboard stats:', err);
                    }
                });

                this.recruiterService.getRecommendations(userId).subscribe({
                    next: (recs) => {
                        this.recommendations = recs;
                    },
                    error: (err) => {
                        console.error('Error loading recommendations:', err);
                    }
                });
            }
        });
    }
}
