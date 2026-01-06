import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNotificationService } from '../../services/admin-notification.service';
import { AuthService } from '../../../shared/services/auth';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    date: Date;
    read: boolean;
}

@Component({
    selector: 'app-admin-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './notifications.html',
    styleUrls: ['./notifications.css']
})
export class AdminNotificationsComponent implements OnInit {

    notifications: Notification[] = [];
    filter: 'all' | 'unread' | 'system' | 'alert' = 'all';
    adminId: number | null = null;

    // New Alert Logic
    showSendModal = false;
    newAlert = {
        target: 'all',
        type: 'INFO' as const,
        title: '',
        message: ''
    };

    constructor(
        private notificationService: AdminNotificationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            this.adminId = Number(user.id);
            this.loadNotifications();
        }
    }

    loadNotifications() {
        if (!this.adminId) return;
        this.notificationService.getNotifications(this.adminId).subscribe({
            next: (data) => {
                this.notifications = data.map(n => ({
                    id: n.id,
                    title: n.title || 'Notification',
                    message: n.message,
                    type: n.type?.toLowerCase() || 'info',
                    date: new Date(n.dateCreation),
                    read: n.isRead
                }));
            },
            error: (err) => console.error('Error loading notifications', err)
        });
    }

    get filteredNotifications() {
        if (this.filter === 'all') return this.notifications;
        if (this.filter === 'unread') return this.notifications.filter(n => !n.read);
        if (this.filter === 'system') return this.notifications.filter(n => n.type === 'system');
        if (this.filter === 'alert') return this.notifications.filter(n => n.type === 'alert' || n.type === 'warning');
        return this.notifications;
    }

    get unreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    setFilter(filter: 'all' | 'unread' | 'system' | 'alert') {
        this.filter = filter;
    }

    markAsRead(notif: Notification) {
        notif.read = true;
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    clearAll() {
        if (confirm('Voulez-vous vraiment effacer toutes les notifications ?')) {
            this.notifications = [];
        }
    }

    deleteNotification(id: number) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    sendAlert() {
        if (!this.newAlert.title || !this.newAlert.message || !this.adminId) {
            alert('Veuillez remplir le titre et le message');
            return;
        }

        const payload = {
            title: this.newAlert.title,
            message: this.newAlert.message,
            type: this.newAlert.type
        };

        this.notificationService.sendNotification(this.adminId, payload).subscribe({
            next: () => {
                alert(`Alerte envoyée avec succès à : ${this.newAlert.target}`);
                this.loadNotifications(); // Refresh list
                this.showSendModal = false;
                this.newAlert = { target: 'all', type: 'INFO', title: '', message: '' };
            },
            error: (err) => console.error('Error sending notification', err)
        });
    }

    // UI Helpers
    getIcon(type: string): string {
        switch (type) {
            case 'info': return 'fas fa-info';
            case 'success': return 'fas fa-check';
            case 'warning': return 'fas fa-exclamation';
            case 'alert': return 'fas fa-exclamation-triangle';
            case 'system': return 'fas fa-cog';
            default: return 'fas fa-bell';
        }
    }

    getIconClass(type: string): string {
        switch (type) {
            case 'info': return 'icon-info';
            case 'success': return 'icon-success';
            case 'warning': return 'icon-warning';
            case 'alert': return 'icon-danger';
            case 'system': return 'bg-light text-dark';
            default: return 'bg-light text-muted';
        }
    }
}
