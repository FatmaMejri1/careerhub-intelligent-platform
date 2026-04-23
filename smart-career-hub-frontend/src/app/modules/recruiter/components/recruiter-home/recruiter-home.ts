import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                const userId = Number(user.id);
                console.log('[RecruiterHome] Loading data for recruiter ID:', userId);

                this.recruiterService.getStatsByRecruiterId(userId).subscribe({
                    next: (data) => {
                        console.log('[RecruiterHome] Stats received:', data);
                        this.stats = data;
                        this.recentApplications = data.recentApplications || [];
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error('Error loading dashboard stats:', err);
                        this.cdr.detectChanges();
                    }
                });

                this.recruiterService.getRecommendations(userId).subscribe({
                    next: (recs) => {
                        console.log('[RecruiterHome] Recommendations received:', recs);
                        this.recommendations = recs;
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error('Error loading recommendations:', err);
                        this.cdr.detectChanges();
                    }
                });
            }
        });
    }
}
