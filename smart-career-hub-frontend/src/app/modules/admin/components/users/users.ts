import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../services/admin-user.service';
import { AdminFraudService } from '../../services/admin-fraud.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './users.html',
    styleUrls: ['./users.css']
})
export class AdminUsersComponent implements OnInit {

    allUsers: any[] = [];
    filteredUsers: any[] = [];
    selectedUser: any = null;
    isAnalyzing: boolean = false;
    aiResult: any = null;

    // Filters
    searchTerm: string = '';
    roleFilter: string = 'all';
    statusFilter: string = 'all';

    constructor(
        private userService: AdminUserService,
        private fraudService: AdminFraudService
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (users: any[]) => {
                this.allUsers = users.map(u => ({
                    ...u,
                    role: (u.role === 'ROLE_CANDIDAT' || u.role === 'CHERCHEUR_EMPLOI') ? 'candidate' :
                        ((u.role === 'ROLE_RECRUTEUR' || u.role === 'RECRUTEUR') ? 'recruiter' : u.role.toLowerCase())
                }));
                this.applyFilters();
            },
            error: (err: any) => console.error('Error loading users', err)
        });
    }

    applyFilters() {
        this.filteredUsers = this.allUsers.filter(user => {
            const name = user.name || '';
            const email = user.email || '';
            const matchesSearch = name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                email.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
            const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }

    resetFilters() {
        this.searchTerm = '';
        this.roleFilter = 'all';
        this.statusFilter = 'all';
        this.applyFilters();
    }

    selectUser(user: any) {
        this.selectedUser = user;
        this.aiResult = null; // Reset AI result when switching users
    }

    runAIAnalysis() {
        if (!this.selectedUser) return;
        this.isAnalyzing = true;
        this.fraudService.getAIAnalysis(this.selectedUser.id).subscribe({
            next: (res) => {
                this.isAnalyzing = false;
                if (!res) {
                    console.warn('AI result is null');
                    return;
                }
                this.aiResult = res;
                // Update the user score in the local list if needed
                if (this.selectedUser && (this.selectedUser.id === res.user_id || this.selectedUser.id === res.id)) {
                    this.selectedUser.fraudScore = res.fraud_score;
                    const u = this.allUsers.find(user => user.id === this.selectedUser.id);
                    if (u) u.fraudScore = res.fraud_score;
                }
            },
            error: (err) => {
                this.isAnalyzing = false;
                console.error('AI Analysis failed', err);
                alert('Erreur d\'analyse: ' + (err.error?.message || 'Serveur AI indisponible'));
            }
        });
    }

    downloadReport() {
        if (!this.selectedUser || !this.aiResult) return;

        // This will call the backend endpoint that generates the report
        const reportUrl = `http://localhost:9099/api/admin/fraud/report/${this.selectedUser.id}`;
        window.open(reportUrl, '_blank');
    }

    downloadReportDirect(user: any) {
        if (!user || user.role !== 'candidate') return;
        const reportUrl = `http://localhost:9099/api/admin/fraud/report/${user.id}`;
        window.open(reportUrl, '_blank');
    }

    getRiskColor(score: number): string {
        if (score >= 90) return 'bg-danger';
        if (score >= 70) return 'bg-warning';
        return 'bg-info';
    }

    getRiskTextColor(score: number): string {
        if (score >= 90) return 'text-danger';
        if (score >= 70) return 'text-warning';
        return 'text-info';
    }

    // Styles helpers
    getReliabilityColor(score: number): string {
        if (score >= 75) return 'bg-success';
        if (score >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    getReliabilityTextColor(score: number): string {
        if (score >= 75) return 'text-success';
        if (score >= 50) return 'text-warning';
        return 'text-danger';
    }

    getFraudScoreColor(score: number): string {
        if (score >= 70) return 'bg-danger';
        if (score >= 40) return 'bg-warning';
        return 'bg-success';
    }

    getFraudScoreTextColor(score: number): string {
        if (score >= 70) return 'text-danger';
        if (score >= 40) return 'text-warning';
        return 'text-success';
    }

    // Actions
    updateStatus(newStatus: string) {
        if (this.selectedUser) {
            this.userService.updateStatus(this.selectedUser.id, newStatus).subscribe({
                next: () => {
                    this.selectedUser.status = newStatus;
                    this.loadUsers(); // Refresh list to sync other screens
                },
                error: (err) => console.error('Error updating status', err)
            });
        }
    }

    deleteUser() {
        if (this.selectedUser && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            this.userService.deleteUser(this.selectedUser.id).subscribe({
                next: () => {
                    this.allUsers = this.allUsers.filter(u => u.id !== this.selectedUser.id);
                    this.applyFilters();
                    this.selectedUser = null;
                },
                error: (err) => console.error('Error deleting user', err)
            });
        }
    }
}
