import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'alert' | 'system';
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

    // New Alert Logic
    showSendModal = false;
    newAlert = {
        target: 'all',
        type: 'info' as const,
        title: '',
        message: ''
    };

    ngOnInit() {
        this.loadMockData();
    }

    loadMockData() {
        this.notifications = [
            {
                id: 1,
                title: 'Nouveau Rapport Mensuel',
                message: 'Le rapport d\'analyse des recrutements du mois de Mars est disponible.',
                type: 'info',
                date: new Date(),
                read: false
            },
            {
                id: 2,
                title: 'Alerte de Sécurité',
                message: 'Tentative de connexion suspecte détectée depuis IP 192.168.1.55',
                type: 'alert',
                date: new Date(Date.now() - 3600000), // 1 hour ago
                read: false
            },
            {
                id: 3,
                title: 'Maintenance Système',
                message: 'Une maintenance est prévue ce soir à 23h00. La plateforme sera inaccessible pendant 30min.',
                type: 'system',
                date: new Date(Date.now() - 86400000), // 1 day ago
                read: true
            },
            {
                id: 4,
                title: 'Inscription Recruteur',
                message: 'L\'entreprise "TechCorp" a finalisé son inscription et attend validation.',
                type: 'success',
                date: new Date(Date.now() - 90000000),
                read: true
            },
            {
                id: 5,
                title: 'Mise à jour IA',
                message: 'Le modèle de matching a été mis à jour avec succès (v2.4).',
                type: 'system',
                date: new Date(Date.now() - 200000000),
                read: true
            }
        ];
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
        if (!this.newAlert.title || !this.newAlert.message) {
            alert('Veuillez remplir le titre et le message');
            return;
        }

        // Mock sending alert
        alert(`Alerte envoyée avec succès à : ${this.newAlert.target}`);

        // Add to local list for feedback
        this.notifications.unshift({
            id: Date.now(),
            title: 'Alerte Envoyée: ' + this.newAlert.title,
            message: `Envoyé à ${this.newAlert.target} : ${this.newAlert.message}`,
            type: 'system',
            date: new Date(),
            read: true
        });

        // Reset and close
        this.showSendModal = false;
        this.newAlert = { target: 'all', type: 'info', title: '', message: '' };
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
