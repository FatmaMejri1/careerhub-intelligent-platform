import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecruiterService, JobOffer } from '../../services/recruiter.service';
import { AuthService } from '../../../shared/services/auth';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-recruiter-job-offers',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './job-offers.html',
    styleUrls: ['./job-offers.css'],
    providers: [RecruiterService]
})
export class RecruiterJobOffersComponent implements OnInit {
    // KPI Data
    kpiData = {
        total: 0,
        active: 0,
        pending: 0,
        totalApplications: 0
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
    isLoading = false;
    errorMessage = '';

    // Form model
    currentOffer: Partial<JobOffer> = {};

    // Data from backend
    allOffers: JobOffer[] = [];
    filteredOffers: JobOffer[] = [];

    // Current recruiter ID (should come from auth service)
    currentRecruiterId: number | null = null;
    private userSubscription?: Subscription;

    constructor(
        private recruiterService: RecruiterService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        console.log('[JobOffers] Component initialized');
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            console.log('[JobOffers] Auth state changed:', user);
            if (user && user.id) {
                this.currentRecruiterId = Number(user.id);
                console.log('[JobOffers] Identified recruiter ID:', this.currentRecruiterId);
                this.loadOffers();
            } else {
                console.warn('[JobOffers] No user or ID found in auth state');
                this.currentRecruiterId = null;
                this.allOffers = [];
                this.filteredOffers = [];
                this.updateKPIs();
            }
        });
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    loadOffers() {
        if (!this.currentRecruiterId) {
            console.warn('[JobOffers] Skipping load: No recruiter ID');
            return;
        }

        console.log('[JobOffers] Loading offers for ID:', this.currentRecruiterId);
        this.isLoading = true;
        this.errorMessage = '';
        this.allOffers = []; // Clear current list to avoid "readded" confusion

        this.recruiterService.getOffersByRecruiterId(this.currentRecruiterId).subscribe({
            next: (offers) => {
                console.log('[JobOffers] Received offers from server:', offers);
                this.allOffers = offers.map(offer => ({
                    ...offer,
                    dateCreation: offer.dateCreation || new Date().toISOString(),
                    type: offer.type || 'CDI',
                    location: offer.location || 'Tunis',
                    applicationsCount: offer.applicationsCount || 0,
                    performanceScore: offer.performanceScore || 0
                }));
                this.applyFilters();
                this.updateKPIs();
                this.isLoading = false;
                console.log('[JobOffers] Offers mapped and displayed:', this.filteredOffers.length);
            },
            error: (error) => {
                console.error('Error loading offers from server:', error);
                this.errorMessage = 'Impossible de charger vos offres. Veuillez vérifier votre connexion.';
                this.isLoading = false;
                this.allOffers = [];
                this.filteredOffers = [];
                this.updateKPIs();
            }
        });
    }

    applyFilters() {
        this.filteredOffers = this.allOffers.filter(offer => {
            const matchesSearch = offer.titre.toLowerCase().includes(this.filters.search.toLowerCase());
            const matchesType = this.filters.type === 'all' || offer.type === this.filters.type;
            const matchesStatus = this.filters.status === 'all' || this.mapStatus(offer.statut) === this.filters.status;
            return matchesSearch && matchesType && matchesStatus;
        });
    }

    updateKPIs() {
        this.kpiData.total = this.allOffers.length;
        this.kpiData.active = this.allOffers.filter(o => o.statut === 'ACTIVE').length;
        this.kpiData.pending = this.allOffers.filter(o => o.statut === 'BROUILLON').length;
        this.kpiData.totalApplications = this.allOffers.reduce((sum, o) => sum + (o.applicationsCount || 0), 0);
    }

    // Modal Actions
    openModal() {
        this.isEditing = false;
        this.currentOffer = {
            titre: '',
            description: '',
            type: 'CDI',
            statut: 'ACTIVE',
            location: 'Tunis',
            recruteurId: this.currentRecruiterId || undefined
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
        this.errorMessage = '';
    }

    saveOffer() {
        if (!this.currentRecruiterId || isNaN(this.currentRecruiterId)) {
            this.errorMessage = 'Erreur d\'authentification : Profil recruteur non identifié';
            return;
        }

        if (!this.currentOffer.titre || !this.currentOffer.description) {
            this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const offerData: JobOffer = {
            titre: this.currentOffer.titre,
            description: this.currentOffer.description,
            statut: this.currentOffer.statut || 'ACTIVE',
            type: this.currentOffer.type || 'CDI',
            location: this.currentOffer.location || 'Tunis',
            recruteurId: this.currentRecruiterId || undefined
        };

        if (this.isEditing && this.currentOffer.id) {
            console.log('Updating offer with ID:', this.currentOffer.id, offerData);
            // Update existing offer
            this.recruiterService.updateOffer(this.currentOffer.id, offerData).subscribe({
                next: (updated) => {
                    console.log('Offer updated successfully', updated);
                    this.loadOffers();
                    this.closeModal();
                },
                error: (error) => {
                    console.error('Error updating offer:', error);
                    this.errorMessage = 'Erreur lors de la mise à jour de l\'offre';
                    this.isLoading = false;
                }
            });
        } else {
            // Create new offer
            this.recruiterService.createOffer(offerData).subscribe({
                next: (created) => {
                    this.loadOffers();
                    this.closeModal();
                },
                error: (error) => {
                    console.error('Error creating offer:', error);
                    this.errorMessage = 'Erreur lors de la création de l\'offre';
                    this.isLoading = false;
                }
            });
        }
    }

    deleteOffer(id: number) {
        console.log('Attempting to delete offer with ID:', id);
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            return;
        }

        this.isLoading = true;
        this.recruiterService.deleteOffer(id).subscribe({
            next: () => {
                console.log('Offer deleted successfully from server');
                this.loadOffers();
            },
            error: (error) => {
                console.error('Error deleting offer:', error);
                this.errorMessage = 'Erreur lors de la suppression de l\'offre';
                this.isLoading = false;
            }
        });
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

    getStatusDotClass(statut: string): string {
        switch (statut) {
            case 'ACTIVE': return 'active';
            case 'CLOTUREE': return 'closed';
            case 'BROUILLON': return 'draft';
            default: return 'bg-secondary';
        }
    }

    mapStatus(backendStatus: string): string {
        switch (backendStatus) {
            case 'ACTIVE': return 'Active';
            case 'CLOTUREE': return 'Clôturée';
            case 'BROUILLON': return 'Brouillon';
            default: return backendStatus;
        }
    }

    getDisplayStatus(statut: string): string {
        return this.mapStatus(statut);
    }
}
