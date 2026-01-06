import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOffersService } from '../../services/admin-offers.service';

interface Offer {
    id: string;
    title: string;
    company: string;
    sector: string;
    date: Date;
    applications: number;
    status: 'Active' | 'Signalée' | 'Expirée' | 'Bloquée';
    qualityScore: number;
    description: string;
    contract: string;
    salary: string;
    skills: string[];
}

@Component({
    selector: 'app-admin-offers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './offers.html',
    styleUrls: ['./offers.css']
})
export class AdminOffersComponent implements OnInit {

    // Data
    allOffers: Offer[] = [];

    filteredOffers: Offer[] = [];
    selectedOffer: Offer | null = null;

    // Filter States
    searchTerm: string = '';
    statusFilter: string = 'all';
    sectorFilter: string = 'all';

    constructor(private offersService: AdminOffersService) { }

    ngOnInit() {
        this.loadOffers();
    }

    loadOffers() {
        this.offersService.getAllOffers().subscribe({
            next: (data: any[]) => {
                this.allOffers = data.map((offer: any) => ({
                    id: offer.id.toString(),
                    title: offer.title,
                    company: offer.company,
                    sector: offer.sector,
                    date: new Date(offer.date),
                    applications: offer.applications || 0,
                    status: this.mapBackendStatus(offer.status),
                    qualityScore: offer.qualityScore || 0,
                    description: offer.description,
                    contract: offer.contract,
                    salary: offer.salary,
                    skills: offer.skills || []
                }));
                this.filteredOffers = [...this.allOffers];
            },
            error: (err: any) => console.error('Failed to load offers', err)
        });
    }

    mapBackendStatus(status: string): 'Active' | 'Signalée' | 'Expirée' | 'Bloquée' {
        if (!status) return 'Active';
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'CLOTUREE': return 'Expirée';
            case 'SIGNALEE': return 'Signalée';
            case 'BLOQUEE': return 'Bloquée';
            case 'BROUILLON': return 'Expirée'; // or inactive
            default: return 'Active';
        }
    }

    applyFilters() {
        this.filteredOffers = this.allOffers.filter(offer => {
            const matchesSearch = offer.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                offer.company.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesStatus = this.statusFilter === 'all' || offer.status.toLowerCase() === this.statusFilter.toLowerCase();
            const matchesSector = this.sectorFilter === 'all' || offer.sector === this.sectorFilter;

            return matchesSearch && matchesStatus && matchesSector;
        });
    }

    resetFilters() {
        this.searchTerm = '';
        this.statusFilter = 'all';
        this.sectorFilter = 'all';
        this.applyFilters();
    }

    selectOffer(offer: Offer) {
        this.selectedOffer = offer;
    }

    // Styles helpers
    getQualityColor(score: number): string {
        if (score >= 80) return 'bg-success';
        if (score >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    getQualityTextColor(score: number): string {
        if (score >= 80) return 'text-success';
        if (score >= 50) return 'text-warning';
        return 'text-danger';
    }

    // Admin Action
    updateStatus(newStatus: 'Active' | 'Signalée' | 'Expirée' | 'Bloquée') {
        if (this.selectedOffer) {
            // Map UI status to Backend Enum strings to avoid accent issues
            let backendStatus = 'ACTIVE';
            switch (newStatus) {
                case 'Active': backendStatus = 'ACTIVE'; break;
                case 'Signalée': backendStatus = 'SIGNALEE'; break;
                case 'Bloquée': backendStatus = 'BLOQUEE'; break;
                case 'Expirée': backendStatus = 'CLOTUREE'; break;
            }

            this.offersService.updateStatus(this.selectedOffer.id, backendStatus).subscribe({
                next: () => {
                    this.selectedOffer!.status = newStatus;
                    // Update main list
                    const target = this.allOffers.find(o => o.id === this.selectedOffer!.id);
                    if (target) target.status = newStatus;
                    this.applyFilters(); // Re-filter in case status changed visibility
                },
                error: (err: any) => alert('Failed to update status: ' + (err.error || 'Server Error'))
            });
        }
    }
}
