import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../services/admin-user.service';

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

    // Filters
    searchTerm: string = '';
    roleFilter: string = 'all';
    statusFilter: string = 'all';

    constructor(private userService: AdminUserService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (users: any[]) => {
                this.allUsers = users.map(u => ({
                    ...u,
                    role: u.role === 'ROLE_CANDIDAT' ? 'candidate' : (u.role === 'ROLE_RECRUTEUR' ? 'recruiter' : u.role)
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
