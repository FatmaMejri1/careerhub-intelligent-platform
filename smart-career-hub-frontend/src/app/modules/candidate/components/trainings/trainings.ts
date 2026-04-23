import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../../../../core/services/analysis.service';
import { CandidateDataService } from '../../services/candidate-data.service';
import { FormationService } from '../../../../core/services/formation.service';

interface Training {
    id: number;
    provider: string; // was platform
    title: string;
    focus: string; // Backend, Frontend, DevOps, etc. (mapped to category in filter)
    category: string; // for filter
    level: 'Débutant' | 'Intermédiaire' | 'Avancé';
    duration: string; // e.g. "12h"
    durationCategory: 'Short' | 'Medium' | 'Long';
    matchScore: number;
    icon: string; // HTML uses [class]="t.icon"
    link: string;
    isCompleted: boolean;
}

interface CompletedTraining {
    title: string;
    date: string; // was completedDate
}

@Component({
    selector: 'app-trainings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './trainings.html',
    styleUrl: './trainings.css'
})
export class TrainingsComponent {
    recommendations: any = null;
    isLoadingRecommendations = false;
    userProfile: any = null;

    constructor(
        private analysisService: AnalysisService,
        private candidateDataService: CandidateDataService,
        private formationService: FormationService
    ) { }

    ngOnInit() {
        this.loadUserProfile();
        this.loadRealFormations();
    }

    loadUserProfile() {
        this.candidateDataService.getProfile().subscribe({
            next: (data) => {
                this.userProfile = data;
                // Automatically generate recommendations if profile is available
                if (data) {
                    this.getAIRecommendations();
                }
            },
            error: (err) => console.error('Failed to load profile', err)
        });
    }

    loadRealFormations() {
        this.formationService.getFormations().subscribe({
            next: (data) => {
                const mapped = data.map(f => ({
                    id: f.id,
                    provider: f.plateforme,
                    title: f.titre,
                    focus: f.competenceAssociee,
                    category: 'Formation',
                    level: f.niveau as any,
                    duration: f.duree,
                    durationCategory: 'Medium' as any,
                    matchScore: 80, // Base match for official courses
                    icon: 'fas fa-university',
                    link: f.url,
                    isCompleted: false
                }));
                // Merge without duplicates (by title)
                const existingTitles = new Set(this.allTrainings.map(t => t.title.toLowerCase()));
                mapped.forEach(m => {
                    if (!existingTitles.has(m.title.toLowerCase())) {
                        this.allTrainings.push(m);
                    }
                });
            },
            error: (err) => console.error('Failed to load real formations', err)
        });
    }

    getAIRecommendations() {
        if (!this.userProfile) return;

        if (this.isLoadingRecommendations) return;
        this.isLoadingRecommendations = true;

        const profileData = {
            titre: this.userProfile.titre || 'Chercheur d\'emploi',
            niveau_experience: this.calculateExperienceLevel(),
            competences: this.parseSkills(this.userProfile.competences),
            objectif: this.userProfile.objectif || '',
            keywords: this.searchTerm || ''
        };

        this.analysisService.recommendForProfile(profileData).subscribe({
            next: (res) => {
                this.recommendations = res;
                // Merge AI recommendations into the main list
                if (res && res.courses) {
                    const aiTrainings: Training[] = res.courses.map((c: any, index: number) => ({
                        id: 1000 + index, // High ID for AI recommendations
                        provider: c.platform || 'Online',
                        title: c.title,
                        focus: 'AI Boost',
                        category: 'Recommended',
                        level: c.difficulty || 'Intermediate',
                        duration: 'Self-paced',
                        durationCategory: 'Medium',
                        matchScore: 98, 
                        icon: 'fas fa-magic',
                        link: c.link || '#', 
                        isCompleted: false
                    }));

                    // Add to allTrainings if not already there
                    aiTrainings.forEach(at => {
                        const exists = this.allTrainings.some(t => t.title.toLowerCase() === at.title.toLowerCase());
                        if (!exists) {
                            this.allTrainings.unshift(at);
                        }
                    });
                }
                this.isLoadingRecommendations = false;
            },
            error: (err) => {
                console.error('Failed to get recommendations', err);
                this.isLoadingRecommendations = false;
            }
        });
    }

    private parseSkills(skillsStr: string): string[] {
        if (!skillsStr) return [];
        try {
            return JSON.parse(skillsStr);
        } catch (e) {
            return [];
        }
    }

    calculateExperienceLevel(): string {
        if (!this.userProfile || !this.userProfile.experiences) return 'Junior';
        try {
            const exps = JSON.parse(this.userProfile.experiences);
            if (exps.length === 0) return 'Junior/Student';
            if (exps.length < 3) return 'Intermediate';
            return 'Senior';
        } catch (e) {
            return 'Junior';
        }
    }
    // Filters
    searchTerm: string = '';
    filterCategory: string = 'All';
    filterDuration: string = 'All';

    // Data Source
    allTrainings: Training[] = [];

    // Mock History
    history: CompletedTraining[] = [];

    // Getters for HTML
    get recommendedTrainings() {
        return this.allTrainings.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || t.category === 'Recommended';
            const matchesCategory = this.filterCategory === 'All' || t.category === this.filterCategory;
            const matchesDuration = this.filterDuration === 'All' || t.durationCategory === this.filterDuration;

            return matchesCategory && matchesDuration && (this.searchTerm ? matchesSearch : true);
        });
    }

    markCompleted(id: number) {
        const training = this.allTrainings.find(t => t.id === id);
        if (training) {
            training.isCompleted = true;
            // Add to history dynamically
            this.history.unshift({
                title: training.title,
                date: new Date().toLocaleDateString('fr-FR')
            });
        }
    }
}
