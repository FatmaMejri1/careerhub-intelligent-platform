import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

    // Mock Data
    allOffers: Offer[] = [
        {
            id: '1', title: 'Senior Angular Developer', company: 'TechSolutions', sector: 'IT', date: new Date('2024-03-10'), applications: 12, status: 'Active', qualityScore: 92,
            description: 'We are looking for an experienced Angular developer to lead our frontend team. Must have 5+ years experience.',
            contract: 'CDI', salary: '50k - 65k', skills: ['Angular', 'RxJS', 'TypeScript']
        },
        {
            id: '2', title: 'Marketing Assistant', company: 'Creative Agency', sector: 'Marketing', date: new Date('2024-03-12'), applications: 45, status: 'Signalée', qualityScore: 45,
            description: 'Need someone for marketing. Call me.',
            contract: 'Stage', salary: 'Non rémunéré', skills: ['Social Media']
        },
        {
            id: '3', title: 'Financial Analyst', company: 'Global Bank', sector: 'Finance', date: new Date('2024-02-28'), applications: 8, status: 'Expirée', qualityScore: 88,
            description: 'Analyze financial data and trends.',
            contract: 'CDI', salary: '45k - 55k', skills: ['Excel', 'Analysis', 'Finance']
        },
        {
            id: '4', title: 'Junior Data Scientist', company: 'DataCorp', sector: 'IT', date: new Date('2024-03-14'), applications: 22, status: 'Active', qualityScore: 78,
            description: 'Join our data team to build predictive models.',
            contract: 'CDD', salary: '35k - 40k', skills: ['Python', 'SQL', 'Machine Learning']
        },
        {
            id: '5', title: 'Rapid Money Maker', company: 'Unknown', sector: 'Marketing', date: new Date('2024-03-15'), applications: 0, status: 'Bloquée', qualityScore: 12,
            description: 'Make money fast from home!!! 1000$ per day!!!',
            contract: 'Freelance', salary: 'Commission', skills: ['None']
        }
    ];

    filteredOffers: Offer[] = [];
    selectedOffer: Offer | null = null;

    // Filter States
    searchTerm: string = '';
    statusFilter: string = 'all';
    sectorFilter: string = 'all';

    ngOnInit() {
        this.filteredOffers = [...this.allOffers];
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
            this.selectedOffer.status = newStatus;
            // In a real app, call API here
        }
    }
}
