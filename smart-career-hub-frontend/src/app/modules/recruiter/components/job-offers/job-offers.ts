import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JobOffer {
    id: number;
    title: string;
    type: string;
    location: string;
    status: 'Active' | 'Clôturée' | 'Brouillon';
    applicationsCount: number;
    performanceScore: number;
    date: Date;
    description?: string;
    skills?: string;
}

@Component({
    selector: 'app-recruiter-job-offers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './job-offers.html',
    styleUrls: ['./job-offers.css']
})
export class RecruiterJobOffersComponent implements OnInit {
    // KPI Data
    kpiData = {
        total: 12,
        active: 5,
        pending: 3,
        totalApplications: 142
    };

    // Filter state
    filters = {
        search: '',
        type: 'all',
        status: 'all'
    };

    // Modal state
    showModal = false;
    isEditing = false;

    // Form model
    currentOffer: Partial<JobOffer> = {};

    // Mock Data
    allOffers: JobOffer[] = [
        { id: 1, title: 'Développeur Full Stack Angular/Node', type: 'CDI', location: 'Tunis', status: 'Active', applicationsCount: 45, performanceScore: 88, date: new Date('2023-10-15') },
        { id: 2, title: 'Stagiaire UX/UI Designer', type: 'Stage', location: 'Sousse', status: 'Active', applicationsCount: 22, performanceScore: 92, date: new Date('2023-11-01') },
        { id: 3, title: 'Chef de Projet Digital', type: 'CDD', location: 'Remote', status: 'Brouillon', applicationsCount: 0, performanceScore: 0, date: new Date('2023-11-20') },
        { id: 4, title: 'Data Analyst Junior', type: 'CDI', location: 'Tunis', status: 'Clôturée', applicationsCount: 68, performanceScore: 75, date: new Date('2023-09-10') },
        { id: 5, title: 'Community Manager', type: 'Freelance', location: 'Remote', status: 'Active', applicationsCount: 12, performanceScore: 60, date: new Date('2023-11-25') },
    ];

    filteredOffers: JobOffer[] = [];

    ngOnInit() {
        this.applyFilters();
    }

    applyFilters() {
        this.filteredOffers = this.allOffers.filter(offer => {
            const matchesSearch = offer.title.toLowerCase().includes(this.filters.search.toLowerCase());
            const matchesType = this.filters.type === 'all' || offer.type === this.filters.type;
            const matchesStatus = this.filters.status === 'all' || offer.status === this.filters.status;
            return matchesSearch && matchesType && matchesStatus;
        });

        // Update KPIs based on current data (mock logic for demo)
        this.kpiData.total = this.allOffers.length;
        this.kpiData.active = this.allOffers.filter(o => o.status === 'Active').length;
        this.kpiData.pending = this.allOffers.filter(o => o.status === 'Brouillon').length;
    }

    // Modal Actions
    openModal() {
        this.isEditing = false;
        this.currentOffer = {
            type: 'CDI',
            status: 'Active',
            location: 'Tunis',
            date: new Date(),
            applicationsCount: 0,
            performanceScore: 0
        };
        this.showModal = true;
    }

    editOffer(offer: JobOffer) {
        this.isEditing = true;
        this.currentOffer = { ...offer };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveOffer() {
        if (this.isEditing) {
            // Update existing
            const index = this.allOffers.findIndex(o => o.id === this.currentOffer.id);
            if (index !== -1) {
                this.allOffers[index] = { ...this.currentOffer } as JobOffer;
            }
        } else {
            // Create new
            const newOffer = {
                ...this.currentOffer,
                id: this.allOffers.length + 1,
                date: new Date(),
                applicationsCount: 0,
                performanceScore: 0
            } as JobOffer;
            this.allOffers.unshift(newOffer);
        }
        this.closeModal();
        this.applyFilters();
        // Here you would typically call a service to save to backend
    }

    deleteOffer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            this.allOffers = this.allOffers.filter(o => o.id !== id);
            this.applyFilters();
        }
    }

    // UI Helpers
    getBadgeClass(type: string): string {
        switch (type) {
            case 'CDI': return 'badge-cdi';
            case 'CDD': return 'badge-cdd';
            case 'Stage': return 'badge-stage';
            case 'Freelance': return 'badge-freelance';
            default: return 'bg-secondary text-white';
        }
    }

    getStatusDotClass(status: string): string {
        switch (status) {
            case 'Active': return 'active';
            case 'Clôturée': return 'closed';
            case 'Brouillon': return 'draft';
            default: return 'bg-secondary';
        }
    }
}
