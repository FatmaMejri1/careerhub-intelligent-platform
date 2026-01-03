import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService, RecruiterStats } from '../../services/recruiter.service';
import { AuthService } from '../../../shared/services/auth';

@Component({
    selector: 'app-recruiter-analytics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './analytics.html',
    styleUrls: ['./analytics.css']
})
export class RecruiterAnalyticsComponent implements OnInit {
    selectedPeriod = 'month';
    stats?: RecruiterStats;
    isLoading = true;
    error = '';

    constructor(
        private recruiterService: RecruiterService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                this.isLoading = true;
                this.recruiterService.getStatsByRecruiterId(Number(user.id)).subscribe({
                    next: (data) => {
                        this.stats = data;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        console.error('Error loading stats:', err);
                        this.error = 'Impossible de charger les statistiques.';
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    getStatusCount(status: string): number {
        return this.stats?.statusDistribution?.[status] || 0;
    }

    getPercentage(status: string): string {
        if (!this.stats || this.stats.totalApplications === 0) return '0%';
        const count = this.getStatusCount(status);
        const percentage = (count / this.stats.totalApplications) * 100;
        return `${Math.round(percentage)}%`;
    }

    getBarWidth(status: string): string {
        return this.getPercentage(status);
    }
}
