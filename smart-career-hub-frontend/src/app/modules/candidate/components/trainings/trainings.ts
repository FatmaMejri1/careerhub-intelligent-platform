import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../../../../core/services/analysis.service';
import { CandidateDataService } from '../../services/candidate-data.service';

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
        private candidateDataService: CandidateDataService
    ) { }

    ngOnInit() {
        this.loadUserProfile();
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

    getAIRecommendations() {
        if (!this.userProfile) return;

        this.isLoadingRecommendations = true;

        const profileData = {
            titre: this.userProfile.titre || 'Chercheur d\'emploi',
            niveau_experience: this.calculateExperienceLevel(),
            competences: this.parseSkills(this.userProfile.competences),
            objectif: this.userProfile.objectif || ''
        };

        this.analysisService.recommendForProfile(profileData).subscribe({
            next: (res) => {
                this.recommendations = res;
                // Populate the main grid with AI recommendations
                if (res && res.courses) {
                    this.allTrainings = res.courses.map((c: any, index: number) => ({
                        id: index + 1,
                        provider: c.platform || 'Online',
                        title: c.title,
                        focus: 'General', // Could be inferred
                        category: 'Recommended',
                        level: c.difficulty || 'Tous niveaux',
                        duration: 'Flexible',
                        durationCategory: 'Medium',
                        matchScore: 95, // AI recommended
                        icon: 'fas fa-graduation-cap',
                        link: c.link || '#', // Ensure link is mapped if available
                        isCompleted: false
                    }));
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
            const matchesSearch = t.title.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = this.filterCategory === 'All' || t.category === this.filterCategory;
            const matchesDuration = this.filterDuration === 'All' || t.durationCategory === this.filterDuration;

            return matchesSearch && matchesCategory && matchesDuration;
        });
    }

    get completedCount() {
        return this.allTrainings.filter(t => t.isCompleted).length + this.history.length;
    }

    get totalCount() {
        return this.allTrainings.length + this.history.length;
    }

    markCompleted(id: number) {
        const training = this.allTrainings.find(t => t.id === id);
        if (training) {
            training.isCompleted = true;
            // In real app, move to history/backend
            // alert(`Cours "${training.title}" marqué comme terminé !`);
        }
    }
}
