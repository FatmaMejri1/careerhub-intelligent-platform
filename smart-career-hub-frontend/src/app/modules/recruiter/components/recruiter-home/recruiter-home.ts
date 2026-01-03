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
    recommendations = [
        { role: 'Senior Java Dev', candidateName: 'Youssef K.', match: 94, skills: 'Java, Spring Boot, Microservices' },
        { role: 'UX Designer', candidateName: 'Nour E.', match: 89, skills: 'Figma, Adobe XD, Prototyping' }
    ];

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
                this.recruiterService.getStatsByRecruiterId(Number(user.id)).subscribe({
                    next: (data) => {
                        this.stats = data;
                        this.recentApplications = data.recentApplications || [];
                    },
                    error: (err) => {
                        console.error('Error loading dashboard stats:', err);
                    }
                });
            }
        });
    }
}
