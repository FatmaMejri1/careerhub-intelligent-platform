import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
    selector: 'app-recruiter-candidates',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './candidates.html',
    styleUrls: ['./candidates.css']
})
export class RecruiterCandidatesComponent implements OnInit {

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

    offers = ['Développeur Full Stack Angular', 'UX/UI Designer', 'Product Owner', 'Data Analyst'];

    selectedCandidate: Candidate | null = null;

    // Mock Data
    allCandidates: Candidate[] = [
        {
            id: 1, name: 'Amine Ben Ali', initials: 'AB', email: 'amine.benali@gmail.com', avatarColor: '#3b82f6',
            offerTitle: 'Développeur Full Stack Angular', matchScore: 92, experience: '3 ans', topSkill: 'Angular',
            status: 'Nouveau', date: new Date('2023-12-10'),
            skills: ['Angular', 'TypeScript', 'Node.js', 'MongoDB'],
            history: [{ role: 'Développeur Frontend', company: 'Tech Corp', duration: '2021-2023', description: 'Développement d\'interfaces web complexes.' }],
            education: [{ degree: 'Ingénieur Informatique', school: 'ENSI', year: '2021' }]
        },
        {
            id: 2, name: 'Sarah Mejbri', initials: 'SM', email: 'sarah.m@yahoo.fr', avatarColor: '#ec4899',
            offerTitle: 'UX/UI Designer', matchScore: 88, experience: '5 ans', topSkill: 'Figma',
            status: 'Présélectionné', date: new Date('2023-12-08'),
            skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
            history: [{ role: 'Lead Designer', company: 'WebAgency', duration: '2019-2023', description: 'Gestion d\'une équipe de 3 designers.' }],
            education: [{ degree: 'Master Design', school: 'ESAD', year: '2018' }]
        },
        {
            id: 3, name: 'Karim Jaziri', initials: 'KJ', email: 'karim.jaz@outlook.com', avatarColor: '#10b981',
            offerTitle: 'Product Owner', matchScore: 74, experience: '4 ans', topSkill: 'Agile',
            status: 'Entretien', date: new Date('2023-11-28'),
            skills: ['Scrum', 'Jira', 'User Stories', 'Roadmapping'],
            history: [{ role: 'Product Owner', company: 'StartupTN', duration: '2020-2023', description: 'Lancement de 2 produits SaaS.' }],
            education: [{ degree: 'Licence Gestion', school: 'IHEC', year: '2019' }]
        },
        {
            id: 4, name: 'Leila Tounsi', initials: 'LT', email: 'leila.t@gmail.com', avatarColor: '#f59e0b',
            offerTitle: 'Développeur Full Stack Angular', matchScore: 95, experience: '2 ans', topSkill: 'Angular',
            status: 'Recruté', date: new Date('2023-11-15'),
            skills: ['Angular', 'RxJS', 'Sass', 'Firebase'],
            history: [{ role: 'Développeur Web', company: 'Freelance', duration: '2021-2023', description: 'Projets divers pour clients internationaux.' }],
            education: [{ degree: 'Ingénieur Logiciel', school: 'INSAT', year: '2021' }]
        },
        {
            id: 5, name: 'Youssef Karray', initials: 'YK', email: 'youssef.k@gmail.com', avatarColor: '#6366f1',
            offerTitle: 'Data Analyst', matchScore: 65, experience: '1 an', topSkill: 'Python',
            status: 'Rejeté', date: new Date('2023-10-05'),
            skills: ['Python', 'Pandas', 'SQL', 'Tableau'],
            history: [{ role: 'Stage Data', company: 'Bank TN', duration: '2022', description: 'Analyse de risques crédits.' }],
            education: [{ degree: 'Master Big Data', school: 'Esprit', year: '2023' }]
        }
    ];

    filteredCandidates: Candidate[] = [];

    ngOnInit() {
        this.applyFilters();
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

    // Helper functions for UI
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
            this.selectedCandidate.status = newStatus;
            this.updateStats();
            // Typically call backend update here
        }
    }

    isStatusActive(step: string): boolean {
        // Simple logic for illustration logic of stepper
        // In real app, define order: Nouveau > Présélectionné > Entretien > Recruté
        const order = ['Nouveau', 'Présélectionné', 'Entretien', 'Recruté'];
        const currentIdx = order.indexOf(this.selectedCandidate?.status || '');
        const stepIdx = order.indexOf(step);
        return stepIdx <= currentIdx && currentIdx !== -1;
    }
}
