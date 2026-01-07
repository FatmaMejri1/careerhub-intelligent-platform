import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JobOffer {
    id?: number;
    titre: string;
    description: string;
    type?: string; // CDI, CDD, Stage, Freelance
    location?: string; // Tunis, Remote, etc.
    statut: 'ACTIVE' | 'CLOTUREE' | 'BROUILLON';
    dateCreation?: string;
    recruteurId?: number;
    applicationsCount?: number;
    performanceScore?: number;
}

export interface Recruiter {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    motDePasse?: string;
    role?: string;
    photoUrl?: string;

    // Enterprise details
    nomEntreprise?: string;
    siteWeb?: string;
    descriptionEntreprise?: string;
    adresseEntreprise?: string;
    poste?: string;

    // Additional fields
    linkedin?: string;
    twitter?: string;
    specialities?: string[];
}

export interface OfferStats {
    id: number;
    title: string;
    views: number;
    applications: number;
    conversionRate: number;
    averageQuality: number;
    delayDays: number;
}

export interface RecruiterStats {
    totalOffers: number;
    totalApplications: number;
    averageTimeToHire: number;
    conversionRate: number;
    statusDistribution: { [key: string]: number };
    topOffers: OfferStats[];
    recentApplications: any[];
    offersGrowth: number;
    appsGrowth: number;
    averageMatchScore: number;
    fraudulentAlertsCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class RecruiterService {
    private apiUrl = 'http://localhost:9099/api';

    constructor(private http: HttpClient) { }

    getAllRecruiters(): Observable<Recruiter[]> {
        return this.http.get<Recruiter[]>(`${this.apiUrl}/recruteur`);
    }

    getRecruiterById(id: number): Observable<Recruiter> {
        return this.http.get<Recruiter>(`${this.apiUrl}/recruteur/${id}`);
    }

    createRecruiter(recruiter: Recruiter): Observable<Recruiter> {
        return this.http.post<Recruiter>(`${this.apiUrl}/recruteur`, recruiter);
    }

    updateRecruiter(id: number, recruiter: Recruiter): Observable<Recruiter> {
        return this.http.put<Recruiter>(`${this.apiUrl}/recruteur/${id}`, recruiter);
    }

    deleteRecruiter(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/recruteur/${id}`);
    }

    getAllOffers(): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/offre`);
    }

    getOfferById(id: number): Observable<JobOffer> {
        return this.http.get<JobOffer>(`${this.apiUrl}/offre/${id}`);
    }

    createOffer(offer: JobOffer): Observable<JobOffer> {
        return this.http.post<JobOffer>(`${this.apiUrl}/offre`, offer);
    }

    updateOffer(id: number, offer: JobOffer): Observable<JobOffer> {
        return this.http.put<JobOffer>(`${this.apiUrl}/offre/${id}`, offer);
    }

    deleteOffer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/offre/${id}`);
    }

    getOffersByRecruiterId(recruiterId: number): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/offre/recruteur/${recruiterId}`);
    }

    getStatsByRecruiterId(recruiterId: number): Observable<RecruiterStats> {
        return this.http.get<RecruiterStats>(`${this.apiUrl}/stats/recruiter/${recruiterId}`);
    }

    getRecommendations(recruiterId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/recruteur/recommendations/${recruiterId}`);
    }

    getCandidaturesByRecruiterId(recruiterId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/candidature/recruteur/${recruiterId}`);
    }

    updateCandidatureStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/candidature/${id}/statut?statut=${status}`, {});
    }

    updatePassword(userId: number, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/utilisateur/${userId}/password`, data);
    }
}
