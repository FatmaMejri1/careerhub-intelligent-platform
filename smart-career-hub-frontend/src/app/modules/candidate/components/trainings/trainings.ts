import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    // Filters
    searchTerm: string = '';
    filterCategory: string = 'All';
    filterDuration: string = 'All';

    // Data Source
    allTrainings: Training[] = [
        {
            id: 1,
            provider: 'Coursera',
            title: 'Spring Boot & REST APIs',
            focus: 'Backend',
            category: 'Backend',
            level: 'Intermédiaire',
            duration: '12h',
            durationCategory: 'Medium',
            matchScore: 95,
            icon: 'fab fa-java',
            link: '#',
            isCompleted: false
        },
        {
            id: 2,
            provider: 'Udemy',
            title: 'Docker pour Débutants',
            focus: 'DevOps',
            category: 'DevOps',
            level: 'Débutant',
            duration: '4h',
            durationCategory: 'Short',
            matchScore: 92,
            icon: 'fab fa-docker',
            link: '#',
            isCompleted: false
        },
        {
            id: 3,
            provider: 'OpenClassrooms',
            title: 'Requêtes SQL Avancées',
            focus: 'Database',
            category: 'Backend',
            level: 'Avancé',
            duration: '8h',
            durationCategory: 'Medium',
            matchScore: 88,
            icon: 'fas fa-database',
            link: '#',
            isCompleted: false
        },
        {
            id: 4,
            provider: 'Pluralsight',
            title: 'Angular Architecture',
            focus: 'Frontend',
            category: 'Frontend',
            level: 'Avancé',
            duration: '25h',
            durationCategory: 'Long',
            matchScore: 85,
            icon: 'fab fa-angular',
            link: '#',
            isCompleted: false
        }
    ];

    // Mock History
    history: CompletedTraining[] = [
        {
            title: 'Angular Core',
            date: '10 Mars 2024'
        },
        {
            title: 'Git Version Control',
            date: '15 Fév 2024'
        }
    ];

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
