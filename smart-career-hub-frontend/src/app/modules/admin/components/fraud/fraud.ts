import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FraudAlert {
    id: string;
    sourceName: string;
    type: 'Offre Suspecte' | 'Profil Faux' | 'Spam' | 'Usurpation';
    date: Date;
    riskScore: number;
    status: 'Nouveau' | 'En cours' | 'Résolu';
    aiAnalysis: string;
    evidence: { label: string; value: string }[];
}

@Component({
    selector: 'app-admin-fraud',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './fraud.html',
    styleUrls: ['./fraud.css']
})
export class AdminFraudComponent implements OnInit {

    selectedAlert: FraudAlert | null = null;
    alerts: FraudAlert[] = [];

    ngOnInit() {
        this.loadMockData();
    }

    loadMockData() {
        this.alerts = [
            {
                id: 'ALT-9921', sourceName: 'Rapid Cash Ltd.', type: 'Offre Suspecte', date: new Date(), riskScore: 95, status: 'Nouveau',
                aiAnalysis: 'L\'offre contient des mots-clés typiques d\'arnaques pyramidales et demande des frais d\'inscription.',
                evidence: [
                    { label: 'Mots Interdits', value: 'argent facile, frais dossier' },
                    { label: 'Email Domaine', value: 'domaine-bizarre.xyz' },
                    { label: 'Rapport Utilisateurs', value: '5 signalements' }
                ]
            },
            {
                id: 'ALT-9922', sourceName: 'Jean Dupont (Fake)', type: 'Profil Faux', date: new Date(Date.now() - 3600000), riskScore: 88, status: 'Nouveau',
                aiAnalysis: 'La photo de profil est une image de stock connue et l\'adresse IP est blacklistée.',
                evidence: [
                    { label: 'Photo Match', value: 'Shutterstock #1234' },
                    { label: 'IP Reputation', value: 'Blacklisted (SpamHaus)' }
                ]
            },
            {
                id: 'ALT-9923', sourceName: 'Tech Recruitment Bot', type: 'Spam', date: new Date(Date.now() - 7200000), riskScore: 65, status: 'En cours',
                aiAnalysis: 'Envoi massif de messages identiques à 50 candidats en 1 minute.',
                evidence: [
                    { label: 'Vitesse Message', value: '50 msg/min' },
                    { label: 'Similarité Texte', value: '100% Identique' }
                ]
            }
        ];
    }

    selectAlert(alert: FraudAlert) {
        this.selectedAlert = alert;
    }

    refreshData() {
        this.selectedAlert = null;
        // Simulate refresh
        const newAlert = {
            id: 'ALT-' + Math.floor(Math.random() * 10000),
            sourceName: 'Nouvelle Menace',
            type: 'Usurpation' as const,
            date: new Date(),
            riskScore: Math.floor(Math.random() * (100 - 50) + 50),
            status: 'Nouveau' as const,
            aiAnalysis: 'Activité inhabituelle détectée récemment.',
            evidence: [{ label: 'Anomalie', value: 'Pattern inconnu' }]
        };
        this.alerts.unshift(newAlert);
    }

    purgeHighRisk() {
        if (confirm('Purger toutes les alertes critiques résolues ?')) {
            // Mock action
        }
    }

    // Actions
    updateStatus(status: 'Nouveau' | 'En cours' | 'Résolu') {
        if (this.selectedAlert) {
            this.selectedAlert.status = status;
        }
    }

    resolveAlert(action: 'Ignorer' | 'Bloquer') {
        if (this.selectedAlert) {
            this.selectedAlert.status = 'Résolu';
            alert(`Action effectuée: ${action} pour ${this.selectedAlert.sourceName}`);
            this.selectedAlert = null;
        }
    }

    // UI Helpers
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

    getTypeIcon(type: string) {
        switch (type) {
            case 'Offre Suspecte': return { icon: 'fas fa-briefcase', bgClass: 'bg-warning-subtle text-warning' };
            case 'Profil Faux': return { icon: 'fas fa-user-secret', bgClass: 'bg-dark-subtle text-dark' };
            case 'Spam': return { icon: 'fas fa-envelope-open-text', bgClass: 'bg-info-subtle text-info' };
            default: return { icon: 'fas fa-exclamation-circle', bgClass: 'bg-danger-subtle text-danger' };
        }
    }
}
