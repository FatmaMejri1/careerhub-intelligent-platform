import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
    skillArea: string;
    difficulty?: string;
}

export interface QuizData {
    title: string;
    questions: QuizQuestion[];
    timeLimit?: number;
}

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './quiz.html',
    styleUrls: ['./quiz.css']
})
export class QuizComponent implements OnInit {
    @Input() jobTitle: string = '';
    @Input() jobDescription: string = '';
    @Output() closeQuiz = new EventEmitter<void>();

    quizData: QuizData | null = null;
    currentQuestionIndex = 0;
    userAnswers: number[] = [];
    isFinished = false;
    score = 0;
    isLoading = true;
    timeLeft = 0;
    timerInterval: any;

    isApplicationFormVisible = false;
    cvFile: File | null = null;
    coverLetter: string = '';

    @Output() quizFinished = new EventEmitter<{ score: number, passed: boolean, cv?: File, letter?: string }>();

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchQuiz();
    }

    ngOnDestroy(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    startTimer(): void {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timeLeft = this.quizData?.timeLimit || 120;
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                clearInterval(this.timerInterval);
                this.calculateResults();
            }
        }, 1000);
    }

    formatTime(): string {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    getDifficultyClass(): string {
        const question = this.quizData?.questions[this.currentQuestionIndex];
        const diff = question?.difficulty?.toLowerCase() || '';
        if (diff.includes('begin') || diff.includes('easy')) return 'easy';
        if (diff.includes('inter')) return 'intermediate';
        if (diff.includes('adv') || diff.includes('diff')) return 'advanced';
        return 'intermediate';
    }

    getDifficultyLabel(): string {
        const question = this.quizData?.questions[this.currentQuestionIndex];
        return question?.difficulty || 'Intermédiaire';
    }

    fetchQuiz(): void {
        this.isLoading = true;
        const url = `http://localhost:9099/api/quiz/generate`;
        const body = {
            title: this.jobTitle,
            description: this.jobDescription
        };
        this.http.post<QuizData>(url, body).subscribe({
            next: (data) => {
                this.quizData = data;
                this.isLoading = false;
                this.userAnswers = new Array(data.questions.length).fill(-1);
                this.startTimer();
            },
            error: (err) => {
                console.error('Error fetching quiz:', err);
                this.isLoading = false;
                this.useMockQuiz();
            }
        });
    }

    private useMockQuiz(): void {
        this.quizData = {
            title: "Évaluation de Compétences Professionnelles",
            questions: [
                {
                    question: "Comment approchez-vous la résolution d'un problème complexe ?",
                    options: [
                        "J'essaie de tout faire d'un coup",
                        "Je décompose le problème en sous-tâches plus simples",
                        "Je demande à quelqu'un d'autre de le résoudre à ma place",
                        "J'attends que le problème disparaisse de lui-même"
                    ],
                    correctOptionIndex: 1,
                    explanation: "La décomposition est une méthode fondamentale en ingénierie.",
                    skillArea: "Analyse & Méthodologie"
                }
            ]
        };
        this.userAnswers = [-1];
    }

    selectOption(index: number): void {
        if (this.isFinished) return;
        this.userAnswers[this.currentQuestionIndex] = index;
    }

    nextQuestion(): void {
        if (this.currentQuestionIndex < (this.quizData?.questions.length || 0) - 1) {
            this.currentQuestionIndex++;
        } else {
            this.calculateResults();
        }
    }

    prevQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    calculateResults(): void {
        if (!this.quizData) return;

        let correctCount = 0;
        this.quizData.questions.forEach((q, i) => {
            if (this.userAnswers[i] === q.correctOptionIndex) {
                correctCount++;
            }
        });

        if (this.quizData.questions.length > 0) {
            this.score = (correctCount / this.quizData.questions.length) * 100;
        } else {
            this.score = 0;
        }
        this.isFinished = true;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    proceedToApplication(): void {
        this.isApplicationFormVisible = true;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.cvFile = file;
        }
    }

    submitApplication(): void {
        this.quizFinished.emit({
            score: this.score,
            passed: this.score >= 65,
            cv: this.cvFile || undefined,
            letter: this.coverLetter
        });
    }

    retry(): void {
        this.isFinished = false;
        this.isApplicationFormVisible = false;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.quizData?.questions.length || 0).fill(-1);
        this.score = 0;
        this.startTimer();
    }

    getRecommendations(): string[] {
        if (!this.quizData) return [];
        const failedAreas: string[] = [];
        this.quizData.questions.forEach((q, i) => {
            if (this.userAnswers[i] !== q.correctOptionIndex) {
                if (q.skillArea && !failedAreas.includes(q.skillArea)) {
                    failedAreas.push(q.skillArea);
                }
            }
        });
        return failedAreas;
    }

    getUdemyLink(area: string): string {
        return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(area)}`;
    }
}
