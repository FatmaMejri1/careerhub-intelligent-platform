import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'candidate' | 'recruiter';
    status: 'Actif' | 'Suspendu' | 'En attente';
    reliabilityScore: number;
    lastActivity: Date;
    joinDate: Date;
    activityCount: number; // Applications or Job Offers
}

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './users.html',
    styleUrls: ['./users.css']
})
export class AdminUsersComponent implements OnInit {

    // Mock Data
    allUsers: User[] = [
        {
            id: 'U001', name: 'Alice Martin', email: 'alice.m@example.com', role: 'candidate', status: 'Actif', reliabilityScore: 98,
            lastActivity: new Date(), joinDate: new Date('2023-11-15'), activityCount: 12
        },
        {
            id: 'U002', name: 'Tech Recruiters Inc.', email: 'hr@techrecruiters.com', role: 'recruiter', status: 'Actif', reliabilityScore: 85,
            lastActivity: new Date('2024-03-20'), joinDate: new Date('2023-10-01'), activityCount: 5
        },
        {
            id: 'U003', name: 'John Doe', email: 'john.fake@spam.com', role: 'candidate', status: 'Suspendu', reliabilityScore: 12,
            lastActivity: new Date('2024-02-10'), joinDate: new Date('2024-02-01'), activityCount: 50
        },
        {
            id: 'U004', name: 'Sophie Dubreuil', email: 's.dubreuil@email.fr', role: 'candidate', status: 'Actif', reliabilityScore: 78,
            lastActivity: new Date('2024-03-21'), joinDate: new Date('2024-01-20'), activityCount: 3
        },
        {
            id: 'U005', name: 'StartUp Nation', email: 'contact@startup.io', role: 'recruiter', status: 'En attente', reliabilityScore: 60,
            lastActivity: new Date('2024-03-22'), joinDate: new Date('2024-03-22'), activityCount: 0
        }
    ];

    filteredUsers: User[] = [];
    selectedUser: User | null = null;

    // Filters
    searchTerm: string = '';
    roleFilter: string = 'all';
    statusFilter: string = 'all';

    ngOnInit() {
        this.filteredUsers = [...this.allUsers];
    }

    applyFilters() {
        this.filteredUsers = this.allUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
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

    selectUser(user: User) {
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
    updateStatus(newStatus: 'Actif' | 'Suspendu' | 'En attente') {
        if (this.selectedUser) {
            this.selectedUser.status = newStatus;
        }
    }

    deleteUser() {
        if (this.selectedUser && confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            this.allUsers = this.allUsers.filter(u => u.id !== this.selectedUser!.id);
            this.applyFilters();
            this.selectedUser = null;
        }
    }
}
