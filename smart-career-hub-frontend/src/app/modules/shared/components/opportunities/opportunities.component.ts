// src/app/modules/shared/components/opportunities/opportunities.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JobCardComponent } from '../job-card/job-card';
import { HeaderComponent } from '../header/header';
import { JobDetailsModalComponent } from '../job-details-modal/job-details-modal.component';
import { AuthService } from '../../services/auth';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { QuizComponent } from '../quiz/quiz';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    match: number;
    logo: string;
    badges: string[];
    url?: string;
    postedDate?: Date | string;
    description?: string;
    isInternal?: boolean;
    internalId?: number;
}

@Component({
    selector: 'app-opportunities',
    standalone: true,
    imports: [CommonModule, JobCardComponent, HeaderComponent, JobDetailsModalComponent, RouterModule, QuizComponent],
    templateUrl: './opportunities.component.html',
    styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
    opportunities: Job[] = [];
    filteredOpportunities: Job[] = [];
    apiUrl = 'http://localhost:9099/api/opportunities';

    // Modal State
    selectedJob: any = null;
    isModalOpen = false;
    isApplicationMode = false;

    // Quiz State
    isQuizOpen = false;
    selectedJobForQuiz: any = null;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const q = params['q'] || '';
            const l = params['l'] || '';
            this.fetchJobs(q, l);
        });
    }

    fetchJobs(q: string = '', l: string = ''): void {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    this.opportunities = this.getFallbackJobs();
                } else {
                    this.opportunities = this.mapJobs(data);
                }

                // Apply initial filters if provided via query params
                if (q || l) {
                    this.filteredOpportunities = this.opportunities.filter(job => {
                        const matchQ = !q ||
                            job.title.toLowerCase().includes(q.toLowerCase()) ||
                            job.company.toLowerCase().includes(q.toLowerCase()) ||
                            (job.description && job.description.toLowerCase().includes(q.toLowerCase()));

                        const matchL = !l ||
                            job.location.toLowerCase().includes(l.toLowerCase());

                        return matchQ && matchL;
                    });
                } else {
                    this.filteredOpportunities = [...this.opportunities];
                }
            },
            error: (error) => {
                console.error('Error fetching jobs, using fallback data:', error);
                this.opportunities = this.getFallbackJobs();
                this.filteredOpportunities = [...this.opportunities];
            }
        });
    }

    mapJobs(data: any[]): Job[] {
        return data.map(job => {
            let cleanTitle = job.title || 'Position Available';
            cleanTitle = cleanTitle.replace(/Latest post.*ago/gi, '').trim();
            cleanTitle = cleanTitle.replace(/JobsLatest.*$/gi, '').trim();

            let company = job.company || 'Company';
            if (company.includes('Recruiter')) {
                company = company.replace('Recruiter', '').trim();
            }

            let location = job.location || 'Tunisia';
            location = location.replace(/\d+[a-f]+/gi, '').trim();

            const isInternal = job.id && job.id.toString().startsWith('internal-');
            const internalId = isInternal ? parseInt(job.id.toString().replace('internal-', '')) : undefined;

            return {
                id: job.id || Math.random().toString(),
                title: cleanTitle,
                company: company,
                location: location,
                salary: job.salary && job.salary.length < 50 ? job.salary : 'Competitive',
                match: job.matchPercentage || Math.floor(Math.random() * 20) + 75,
                logo: job.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=random`,
                badges: Array.isArray(job.badges) ? job.badges : ['Full-time'],
                url: job.url && job.url.startsWith('http') ? job.url : undefined,
                postedDate: job.postedDate || new Date(),
                description: job.description || `Job opening for ${cleanTitle} at ${company} in ${location}.`,
                isInternal: isInternal,
                internalId: internalId
            };
        });
    }

    getFallbackJobs(): Job[] {
        const now = new Date();
        return [
            { id: '1', title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Tunis, Tunisia', salary: '3500 TND', match: 98, logo: 'https://logo.clearbit.com/google.com', badges: ['Remote', 'Senior', 'Angular'], url: 'https://weworkremotely.com/job1', postedDate: new Date(now.getTime() - 8 * 60 * 60 * 1000) },
        ];
    }

    filterJobs(event: Event): void {
        const input = event.target as HTMLInputElement;
        const query = input.value.toLowerCase();
        this.filteredOpportunities = this.opportunities.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query)
        );
    }

    // Modal Logic
    openJobDetails(event: { job: any, mode: 'view' | 'apply' }): void {
        this.selectedJob = event.job;
        this.isApplicationMode = event.mode === 'apply';
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.selectedJob = null;
        document.body.style.overflow = ''; // Restore scrolling
    }

    onApplyFromModal(event: { job: any, coverLetter: string }): void {
        const user = this.authService.getCurrentUser();

        if (!user) {
            this.router.navigate(['/auth/login']);
            this.closeModal();
            return;
        }

        if (event.job.isInternal) {
            // Trigger Quiz instead of direct apply
            this.selectedJobForQuiz = event.job;
            this.isQuizOpen = true;
            this.closeModal();
        } else {
            // External application tracking
            console.log('Applied via modal (external):', event);
            this.trackApplication(event.job.id);
            this.closeModal();
        }
    }

    onQuizFinished(result: { score: number, passed: boolean, cv?: File, letter?: string }): void {
        if (result.passed) {
            this.finalizeApplication(this.selectedJobForQuiz, result.score, result.cv, result.letter);
        } else {
            // The quiz component handles showing failure state
        }
    }

    finalizeApplication(job: any, score?: number, cv?: File, letter?: string): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        const userId = Number(user.id);
        const offreId = job.internalId;

        const url = `http://localhost:9099/api/candidature/chercheur/${userId}/offre/${offreId}`;

        const formData = new FormData();
        if (score !== undefined) {
            formData.append('score', score.toString());
        }
        if (cv) {
            formData.append('cv', cv);
        }
        if (letter) {
            formData.append('letter', letter);
        }

        this.http.post(url, formData).subscribe({
            next: () => {
                alert('Félicitations ! Votre candidature a été transmise au recruteur avec succès.');
                this.trackApplication(job.id);
                this.closeQuiz();
            },
            error: (err) => {
                console.error('Error applying with details:', err);
                alert('Erreur lors de l\'envoi de la candidature (Problème serveur ou fichier trop volumineux).');
                this.closeQuiz();
            }
        });
    }

    closeQuiz(): void {
        this.isQuizOpen = false;
        this.selectedJobForQuiz = null;
    }

    private trackApplication(jobId: string): void {
        const applications = JSON.parse(localStorage.getItem('user_applications') || '[]');
        if (!applications.some((app: any) => app.jobId === jobId)) {
            applications.push({ jobId, date: new Date() });
            localStorage.setItem('user_applications', JSON.stringify(applications));
        }
    }
}
