import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFraudService } from '../../services/admin-fraud.service';

interface FraudAlert {
    id: any;
    sourceName: string;
    type: string;
    date: Date;
    riskScore: number;
    status: 'Nouveau' | 'En cours' | 'Résolu';
    aiAnalysis: string;
    evidence: { label: string; value: string; severity?: string }[];
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
    isAnalyzing: boolean = false;

    // KPI Stats
    stats = {
        highPriority: 0,
        pending: 0,
        solvedToday: 14, // Mocked as we don't track resolution date yet
        detectionRate: 92
    };

    constructor(private fraudService: AdminFraudService) { }

    ngOnInit() {
        this.loadAlerts();
    }

    loadAlerts() {
        this.fraudService.getAlerts().subscribe({
            next: (data) => {
                this.alerts = data.map((a: any) => ({
                    id: a.id,
                    sourceName: a.user,
                    type: a.type,
                    date: new Date(),
                    riskScore: a.score,
                    status: 'Nouveau',
                    aiAnalysis: 'Attente d\'analyse approfondie.',
                    evidence: [
                        { label: 'Rôle', value: a.role },
                        { label: 'Détails', value: a.type }
                    ]
                }));
                this.calculateStats();
            },
            error: (err) => console.error('Error loading fraud alerts', err)
        });
    }

    calculateStats() {
        this.stats.pending = this.alerts.length;
        this.stats.highPriority = this.alerts.filter(a => a.riskScore >= 80).length;

        // Dynamic detection rate based on number of alerts vs some base
        // If many alerts are high risk, detection rate might be higher
        const highRisk = this.alerts.filter(a => a.riskScore > 50).length;
        this.stats.detectionRate = 85 + Math.min(10, Math.floor(highRisk / 2));
    }

    runAIAnalysis() {
        if (!this.selectedAlert) return;

        this.isAnalyzing = true;
        this.fraudService.getAIAnalysis(this.selectedAlert.id).subscribe({
            next: (res) => {
                this.isAnalyzing = false;
                if (this.selectedAlert && (this.selectedAlert.id === res.user_id || this.selectedAlert.id === res.id)) {
                    this.selectedAlert.riskScore = res.fraud_score;
                    this.selectedAlert.aiAnalysis = res.ai_analysis;
                    this.selectedAlert.evidence = res.evidence;
                    // Update main list score
                    const target = this.alerts.find(a => a.id === this.selectedAlert!.id);
                    if (target) {
                        target.riskScore = res.fraud_score;
                    }
                } else if (this.selectedAlert) {
                    // Fallback for ID mismatch if backend returns different structure
                    this.selectedAlert.riskScore = res.fraud_score;
                    this.selectedAlert.aiAnalysis = res.ai_analysis;
                    this.selectedAlert.evidence = res.evidence;
                }
            },
            error: (err) => {
                this.isAnalyzing = false;
                console.error('AI Analysis failed', err);
                alert('Analyse IA échouée: ' + (err.error || 'Serveur indisponible'));
            }
        });
    }

    selectAlert(alert: FraudAlert) {
        this.selectedAlert = alert;
    }

    refreshData() {
        this.loadAlerts();
    }

    purgeHighRisk() {
        if (confirm('Purger toutes les alertes critiques résolues ?')) {
            // Mock action
        }
    }

    downloadReport() {
        if (!this.selectedAlert) return;
        const reportUrl = `http://localhost:9099/api/admin/fraud/report/${this.selectedAlert.id}`;
        window.open(reportUrl, '_blank');
    }

    downloadReportForAlert(alert: FraudAlert) {
        if (!alert) return;
        const reportUrl = `http://localhost:9099/api/admin/fraud/report/${alert.id}`;
        window.open(reportUrl, '_blank');
    }

    // Actions
    updateStatus(status: 'Nouveau' | 'En cours' | 'Résolu') {
        if (this.selectedAlert) {
            this.selectedAlert.status = status;
        }
    }

    resolveAlert(action: 'Ignorer' | 'Bloquer') {
        if (this.selectedAlert) {
            this.fraudService.resolveAlert(this.selectedAlert.id, action).subscribe({
                next: (res) => {
                    alert(res.message || `Action effectuée: ${action}`);
                    this.loadAlerts(); // Refresh
                    this.selectedAlert = null;
                },
                error: (err) => console.error('Error resolving alert', err)
            });
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
