import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateDataService } from '../../services/candidate-data.service';

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

    constructor(
        private router: Router,
        private candidateService: CandidateDataService
    ) { }

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        this.candidateService.getApplications().subscribe({
            next: (apps) => {
                this.applications = apps.map((app: any) => ({
                    id: app.id,
                    jobId: app.offre?.id,
                    companyName: app.offre?.recruteur?.nomEntreprise || 'N/A',
                    jobTitle: app.offre?.titre || 'Poste inconnu',
                    location: app.offre?.location || 'Non spécifié',
                    appliedDate: app.dateCandidature || new Date().toISOString(),
                    status: app.statut,
                    timelineStep: this.getTimelineStep(app.statut),
                    salary: 'N/A', // Mock until available in DB
                }));
            },
            error: (err) => console.error('Error loading applications', err)
        });
    }

    getTimelineStep(status: string): number {
        switch (status) {
            case 'EN_ATTENTE': return 1;
            case 'A_L_EXAMEN': return 2;
            case 'INTERVIEW': return 2;
            case 'ACCEPTEE': return 3;
            case 'REFUSEE': return 3;
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
            this.candidateService.cancelApplication(id).subscribe({
                next: () => {
                    alert('Candidature annulée avec succès.');
                    this.loadApplications();
                },
                error: (err) => {
                    console.error('Cancel error', err);
                    alert('Erreur lors de l\'annulation.');
                }
            });
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
