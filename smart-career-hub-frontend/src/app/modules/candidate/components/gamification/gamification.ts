import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Game {
    id: number;
    type: 'QUIZ' | 'CHALLENGE' | 'LOGIC';
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    duration: string;
    xpPoints: number;
    tech?: string;
    description?: string;
    icon: string;
    completed?: boolean;
}

interface Badge {
    name: string;
    icon: string;
    colorClass: string;
    unlocked: boolean;
}

interface HistoryItem {
    gameTitle: string;
    score: string;
    xpEarned: number;
    date: string;
    skillImproved: string;
}

@Component({
    selector: 'app-gamification',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './gamification.html',
    styleUrl: './gamification.css'
})
export class GamificationComponent {

    // Player Stats
    playerLevel = 4;
    currentXp = 850;
    nextLevelXp = 1000;
    totalGamesPlayed = 12;
    employabilityBoost = 8; // +8% impact

    // Skills Progress
    skills = [
        { name: 'Java', progress: 80, color: 'bg-danger' },
        { name: 'Angular', progress: 50, color: 'bg-primary' },
        { name: 'SQL', progress: 65, color: 'bg-warning' },
        { name: 'Spring Boot', progress: 40, color: 'bg-success' }
    ];

    // Badges
    badges: Badge[] = [
        { name: 'Java Rookie', icon: 'fab fa-java', colorClass: 'badge-java', unlocked: true },
        { name: 'Spring Master', icon: 'fas fa-leaf', colorClass: 'badge-spring', unlocked: false },
        { name: 'Backend Challenger', icon: 'fas fa-server', colorClass: 'badge-backend', unlocked: true },
        { name: '7-Day Streak', icon: 'fas fa-fire', colorClass: 'badge-streak', unlocked: true }
    ];

    // Games List
    games: Game[] = [
        // Quizzes
        { id: 1, type: 'QUIZ', title: 'Java Core Quiz', tech: 'Java', difficulty: 'Intermediate', duration: '10 min', xpPoints: 50, icon: 'fab fa-java' },
        { id: 2, type: 'QUIZ', title: 'Angular Basics', tech: 'Angular', difficulty: 'Beginner', duration: '5 min', xpPoints: 30, icon: 'fab fa-angular' },

        // Challenges
        { id: 3, type: 'CHALLENGE', title: 'Fix the Bug', description: 'Find the logic error in this Spring Service.', difficulty: 'Advanced', duration: '15 min', xpPoints: 100, icon: 'fas fa-bug' },

        // Logic Games
        { id: 4, type: 'LOGIC', title: 'SQL Master', description: 'Optimize this query for performance.', difficulty: 'Intermediate', duration: '8 min', xpPoints: 60, icon: 'fas fa-database' }
    ];

    // History
    history: HistoryItem[] = [
        { gameTitle: 'Java Core Quiz', score: '9/10', xpEarned: 50, date: 'Today', skillImproved: 'Java +5%' },
        { gameTitle: 'SQL Master', score: 'Completed', xpEarned: 60, date: 'Yesterday', skillImproved: 'SQL +3%' }
    ];

    get xpPercentage() {
        return (this.currentXp / this.nextLevelXp) * 100;
    }

    playGame(game: Game) {
        if (confirm(`Start ${game.title}? This will take approx ${game.duration}.`)) {
            // In a real app, this would route to the game interface
            alert('Game started! (Simulation)');
        }
    }
}
