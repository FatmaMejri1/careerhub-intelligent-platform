import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStatsService } from '../../services/admin-stats.service';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-home.html',
    styleUrls: ['./admin-home.css']
})
export class AdminHomeComponent implements OnInit {
    stats: any = {
        totalUsers: 0,
        totalOffers: 0,
        reportedFrauds: 0,
        recentUsers: [],
        fraudAlerts: []
    };

    fraudAlerts: any[] = [];

    constructor(private statsService: AdminStatsService) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.statsService.getAdminStats().subscribe({
            next: (data) => {
                this.stats = data;
                this.fraudAlerts = data.fraudAlerts || [];
            },
            error: (err) => console.error('Error loading admin stats', err)
        });
    }
}
