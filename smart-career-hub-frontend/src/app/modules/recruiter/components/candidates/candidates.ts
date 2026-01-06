import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../services/recruiter.service';
import { AuthService } from '../../../shared/services/auth';
import { finalize } from 'rxjs';

interface Candidate {
    id: number;
    name: string;
    initials: string;
    email: string;
    avatarColor: string;
    offerTitle: string;
    matchScore: number;
    experience: string;
    topSkill: string;
    status: 'Nouveau' | 'Présélectionné' | 'Entretien' | 'Recruté' | 'Rejeté';
    date: Date;
    skills: string[];
    history: any[];
    education: any[];
    fraudScore?: number;
    cvUrl?: string;
}

@Component({
    selector: 'app-recruiter-candidates',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './candidates.html',
    styleUrls: ['./candidates.css']
})
export class RecruiterCandidatesComponent implements OnInit {

    offers: string[] = [];
    isLoading = false;

    // Stats
    stats = {
        total: 0,
        preselected: 0,
        interview: 0,
        hired: 0
    };

    // Filter State
    filters = {
        search: '',
        offer: 'all',
        status: 'all',
        match: '0'
    };

    allCandidates: Candidate[] = [];
    filteredCandidates: Candidate[] = [];
    selectedCandidate: Candidate | null = null;

    constructor(
        private recruiterService: RecruiterService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadCandidates();
    }

    loadCandidates() {
        const user = this.authService.getCurrentUser();
        if (!user || user.role !== 'recruiter') return;

        this.isLoading = true;
        this.recruiterService.getCandidaturesByRecruiterId(Number(user.id))
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (data) => {
                    this.allCandidates = data.map(c => this.mapBackendToCandidate(c));
                    this.offers = [...new Set(this.allCandidates.map(c => c.offerTitle))];
                    this.applyFilters();
                },
                error: (err) => {
                    console.error('Error fetching candidates:', err);
                    this.isLoading = false;
                }
            });
    }

    mapBackendToCandidate(c: any): Candidate {
        console.log('DEBUG: Raw backend data for candidature:', c.id, c);
        const chercheur = c.chercheurEmploi || {};
        const name = `${chercheur.nom || ''} ${chercheur.prenom || ''}`.trim() || 'Candidat';
        const initials = (chercheur.nom?.[0] || '') + (chercheur.prenom?.[0] || '');

        let skills = [];
        try {
            skills = typeof chercheur.competences === 'string' ? JSON.parse(chercheur.competences) : (chercheur.competences || []);
        } catch (e) { skills = []; }

        let history = [];
        try {
            history = typeof chercheur.experiences === 'string' ? JSON.parse(chercheur.experiences) : (chercheur.experiences || []);
        } catch (e) { history = []; }

        let education = [];
        try {
            education = typeof chercheur.educations === 'string' ? JSON.parse(chercheur.educations) : (chercheur.educations || []);
        } catch (e) { education = []; }

        const colors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];
        const randomColor = colors[Math.floor(Math.random() * (c.id % colors.length))];

        let status: any = 'Nouveau';
        if (c.statut === 'ACCEPTEE') status = 'Présélectionné';
        else if (c.statut === 'REFUSEE') status = 'Rejeté';
        else if (c.statut === 'ENTRETIEN') status = 'Entretien';
        else if (c.statut === 'RECRUTE') status = 'Recruté';

        // Check all possible CV URL sources
        const cvFromCandidature = c.cvUrl;
        const cvFromChercheur = chercheur.cvUrl;
        const finalCvUrl = cvFromCandidature || cvFromChercheur || '';

        console.log(`DEBUG: CV URLs for ${name}:`, {
            candidatureCV: cvFromCandidature,
            chercheurCV: cvFromChercheur,
            final: finalCvUrl
        });

        const candidateResult = {
            id: c.id,
            name: name,
            initials: initials || 'C',
            email: chercheur.email || 'N/A',
            avatarColor: randomColor,
            offerTitle: c.offre?.titre || 'Offre inconnue',
            matchScore: Math.round(chercheur.employabilityScore || c.quizScore || 0),
            experience: chercheur.niveauExperience || 'N/A',
            topSkill: (skills && skills.length > 0) ? skills[0] : 'N/A',
            status: status,
            date: c.dateCreation ? new Date(c.dateCreation) : (c.offre?.dateCreation ? new Date(c.offre.dateCreation) : new Date()),
            skills: skills || [],
            history: history || [],
            education: education || [],
            fraudScore: chercheur.fraudScore || 0,
            cvUrl: finalCvUrl
        };

        return candidateResult;
    }

    applyFilters() {
        this.filteredCandidates = this.allCandidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                c.topSkill.toLowerCase().includes(this.filters.search.toLowerCase());
            const matchesOffer = this.filters.offer === 'all' || c.offerTitle === this.filters.offer;
            const matchesStatus = this.filters.status === 'all' || c.status === this.filters.status;
            const matchesMatch = c.matchScore >= parseInt(this.filters.match);

            return matchesSearch && matchesOffer && matchesStatus && matchesMatch;
        });

        this.updateStats();
    }

    updateStats() {
        this.stats.total = this.allCandidates.length;
        this.stats.preselected = this.allCandidates.filter(c => c.status === 'Présélectionné').length;
        this.stats.interview = this.allCandidates.filter(c => c.status === 'Entretien').length;
        this.stats.hired = this.allCandidates.filter(c => c.status === 'Recruté').length;
    }

    selectCandidate(candidate: Candidate) {
        this.selectedCandidate = candidate;
    }

    closePanel() {
        this.selectedCandidate = null;
    }

    getStatusBadgeClass(status: string) {
        switch (status) {
            case 'Nouveau': return 'badge-status-new';
            case 'Présélectionné': return 'badge-status-preselected';
            case 'Entretien': return 'badge-status-interview';
            case 'Recruté': return 'badge-status-hired';
            case 'Rejeté': return 'badge-status-rejected';
            default: return 'bg-secondary';
        }
    }

    getScoreClass(score: number) {
        if (score >= 90) return 'bg-success';
        if (score >= 70) return 'bg-primary';
        return 'bg-warning';
    }

    getTextScoreClass(score: number) {
        if (score >= 90) return 'text-success';
        if (score >= 70) return 'text-primary';
        return 'text-warning';
    }

    updateStatus(newStatus: 'Nouveau' | 'Présélectionné' | 'Entretien' | 'Recruté' | 'Rejeté') {
        if (this.selectedCandidate) {
            const oldStatus = this.selectedCandidate.status;
            this.selectedCandidate.status = newStatus;

            let backendStatut = 'EN_ATTENTE';
            if (newStatus === 'Présélectionné') backendStatut = 'ACCEPTEE';
            else if (newStatus === 'Rejeté') backendStatut = 'REFUSEE';
            else if (newStatus === 'Entretien') backendStatut = 'ENTRETIEN';
            else if (newStatus === 'Recruté') backendStatut = 'RECRUTE';

            this.recruiterService.updateCandidatureStatus(this.selectedCandidate.id, backendStatut)
                .subscribe({
                    next: () => {
                        this.updateStats();
                    },
                    error: (err) => {
                        console.error('Error updating status:', err);
                        this.selectedCandidate!.status = oldStatus;
                    }
                });
        }
    }

    exportReport() {
        if (this.filteredCandidates.length === 0) return;

        const headers = ['Nom', 'Email', 'Offre', 'Score IA', 'Expérience', 'Statut', 'Date'];
        const csvRows = [
            headers.join(','),
            ...this.filteredCandidates.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.offerTitle}"`,
                `${c.matchScore}%`,
                `"${c.experience}"`,
                `"${c.status}"`,
                `"${c.date.toLocaleDateString()}"`
            ].join(','))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rapport_candidats_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    isStatusActive(step: string): boolean {
        const order = ['Nouveau', 'Présélectionné', 'Entretien', 'Recruté'];
        const currentIdx = order.indexOf(this.selectedCandidate?.status || '');
        const stepIdx = order.indexOf(step);
        return stepIdx <= currentIdx && currentIdx !== -1;
    }

    viewCv(candidate: Candidate) {
        console.log('Attempting to view CV for:', candidate.name, 'URL:', candidate.cvUrl);
        if (candidate.cvUrl) {
            // Use the new file serving endpoint
            const url = `http://localhost:9099/api/files/cv?path=${encodeURIComponent(candidate.cvUrl)}`;
            console.log('Opening CV at:', url);
            window.open(url, '_blank');
        } else {
            console.warn('No CV URL available for candidate:', candidate);
            alert('CV non disponible pour ce candidat.');
        }
    }

    contactCandidate(candidate: Candidate) {
        window.location.href = `mailto:${candidate.email}?subject=Candidature pour ${candidate.offerTitle}`;
    }

    onUpdateStatus(event: Event, candidate: Candidate, status: 'Présélectionné' | 'Rejeté') {
        event.stopPropagation();
        const oldSelected = this.selectedCandidate;
        this.selectedCandidate = candidate;
        this.updateStatus(status);
        if (!oldSelected) this.selectedCandidate = null; // Reset if none was selected
        else this.selectedCandidate = oldSelected; // Restore previous selection
    }
}
