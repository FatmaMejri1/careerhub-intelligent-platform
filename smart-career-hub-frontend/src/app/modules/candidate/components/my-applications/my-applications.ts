import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Application {
    id: number;
    jobId: string | number;
    companyName: string;
    jobTitle: string;
    location: string;
    appliedDate: string;
    status: 'PENDING' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'INTERVIEW';
    logo?: string;
    timelineStep: number;
    salary?: string;
    coverLetter?: string;
}

@Component({
    selector: 'app-my-applications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './my-applications.html',
    styleUrl: './my-applications.css'
})
export class MyApplicationsComponent implements OnInit {
    searchTerm: string = '';
    statusFilter: string = 'ALL';
    dateFilter: string = 'newest';

    applications: Application[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        const apps = localStorage.getItem('user_applications');
        if (apps) {
            const parsedApps = JSON.parse(apps);
            this.applications = parsedApps.map((app: any) => ({
                id: app.id,
                jobId: app.jobId,
                companyName: app.company,
                jobTitle: app.title,
                location: app.location || 'Non spécifié',
                appliedDate: app.appliedDate,
                status: app.status,
                timelineStep: this.getTimelineStep(app.status),
                salary: app.salary,
                coverLetter: app.coverLetter
            }));
        }
    }

    getTimelineStep(status: string): number {
        switch (status) {
            case 'PENDING': return 1;
            case 'IN_REVIEW': return 2;
            case 'INTERVIEW': return 2;
            case 'ACCEPTED': return 3;
            case 'REJECTED': return 3;
            default: return 1;
        }
    }

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
            case 'INTERVIEW': return 'status-interview';
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

            // Update localStorage
            const apps = localStorage.getItem('user_applications');
            if (apps) {
                const parsedApps = JSON.parse(apps);
                const updated = parsedApps.filter((app: any) => app.id !== id);
                localStorage.setItem('user_applications', JSON.stringify(updated));
            }
        }
    }

    viewJob(jobId: string | number) {
        console.log('Naviguer vers l\'offre:', jobId);
        this.router.navigate(['/opportunities']);
    }

    viewApplication(id: number) {
        const app = this.applications.find(a => a.id === id);
        if (app) {
            let details = `Détails de la candidature\n\n`;
            details += `Poste: ${app.jobTitle}\n`;
            details += `Entreprise: ${app.companyName}\n`;
            details += `Lieu: ${app.location}\n`;
            if (app.salary) details += `Salaire: ${app.salary}\n`;
            details += `Date de candidature: ${new Date(app.appliedDate).toLocaleDateString('fr-FR')}\n`;
            details += `Statut: ${this.getStatusLabel(app.status)}\n`;
            if (app.coverLetter) details += `\nLettre de motivation:\n${app.coverLetter}`;

            alert(details);
        }
    }
}
