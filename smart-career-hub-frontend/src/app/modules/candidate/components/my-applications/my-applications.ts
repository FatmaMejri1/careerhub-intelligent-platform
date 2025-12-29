import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Application {
    id: number;
    jobId: number;
    companyName: string;
    jobTitle: string;
    location: string;
    appliedDate: string;
    status: 'PENDING' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'INTERVIEW';
    logo?: string;
    timelineStep: number;
    salary?: string;
}

@Component({
    selector: 'app-my-applications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './my-applications.html',
    styleUrl: './my-applications.css'
})
export class MyApplicationsComponent {
    searchTerm: string = '';
    statusFilter: string = 'ALL';
    dateFilter: string = 'newest';

    applications: Application[] = [
        {
            id: 1,
            jobId: 101,
            companyName: 'Tech Solutions Inc.',
            jobTitle: 'Développeur Angular Senior',
            location: 'Tunis, Tunisie (Télétravail)',
            appliedDate: '2024-05-12',
            status: 'IN_REVIEW',
            timelineStep: 2,
            salary: '4500 TND'
        },
        {
            id: 2,
            jobId: 102,
            companyName: 'Global Corp',
            jobTitle: 'Ingénieur Frontend',
            location: 'Paris, France',
            appliedDate: '2024-05-15',
            status: 'PENDING',
            timelineStep: 1,
            salary: '3200 EUR'
        },
        {
            id: 3,
            jobId: 103,
            companyName: 'StartUp AI',
            jobTitle: 'Développeur Full Stack',
            location: 'Berlin, Allemagne',
            appliedDate: '2024-04-20',
            status: 'REJECTED',
            timelineStep: 3,
            salary: '55000 EUR/an'
        },
        {
            id: 4,
            jobId: 104,
            companyName: 'Smart Systems',
            jobTitle: 'Designer UI/UX',
            location: 'Londres, UK',
            appliedDate: '2024-05-01',
            status: 'ACCEPTED',
            timelineStep: 3,
            salary: '3000 GBP'
        }
    ];

    constructor(private router: Router) { }

    get filteredApplications() {
        return this.applications.filter(app => {
            const matchesSearch = app.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                app.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesFilter = this.statusFilter === 'ALL' || app.status === this.statusFilter;

            return matchesSearch && matchesFilter;
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'IN_REVIEW': return 'status-review';
            case 'INTERVIEW': return 'status-interview'; // Added style class
            case 'ACCEPTED': return 'status-accepted';
            case 'REJECTED': return 'status-rejected';
            default: return '';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING': return 'En Attente';
            case 'IN_REVIEW': return 'En Revue';
            case 'INTERVIEW': return 'Entretien';
            case 'ACCEPTED': return 'Accepté';
            case 'REJECTED': return 'Refusé';
            default: return status;
        }
    }

    cancelApplication(id: number) {
        if (confirm('Êtes-vous sûr de vouloir annuler cette candidature ?')) {
            this.applications = this.applications.filter(app => app.id !== id);
        }
    }

    viewJob(jobId: number) {
        console.log('Naviguer vers l\'offre:', jobId);
        // this.router.navigate(['/jobs', jobId]);
    }

    viewApplication(id: number) {
        console.log('Voir détails candidature:', id);
        // this.router.navigate(['/candidate/applications', id]);
    }
}
