import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../../shared/services/api';
import { AuthService } from '../../shared/services/auth';
import { Recruiter } from './recruiter.service';

@Injectable({
    providedIn: 'root'
})
export class RecruiterProfileService {
    private profileSubject = new BehaviorSubject<Recruiter | null>(null);
    profile$ = this.profileSubject.asObservable();

    private profileImageSource = new BehaviorSubject<string | null>(null);
    profileImage$ = this.profileImageSource.asObservable();

    constructor(private apiService: ApiService, private authService: AuthService) {
        // Subscribe to user changes to automatically load/clear profile
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                // If user changed or just logged in, load their profile
                this.loadProfile(user);
            } else {
                // User logged out, clear profile
                this.profileSubject.next(null);
                this.profileImageSource.next(null);
            }
        });
    }

    loadProfile(user: any) {
        if (user && user.id) {
            this.apiService.get<Recruiter>(`recruteur/${user.id}`).subscribe({
                next: (profile) => {
                    this.profileSubject.next(profile);
                    if (profile.photoUrl) {
                        this.profileImageSource.next(profile.photoUrl);
                    }
                },
                error: (err) => {
                    // It's expected to get 404 if the user is new/promoted but hasn't filled profile yet
                    // OR if the user is a generic 'User' but not yet in 'Recruteur' table.
                    console.warn("Recruiter profile not found (404). Initializing from Auth info:", user);

                    const basicProfile: Recruiter = {
                        id: Number(user.id),
                        nom: user.name ? user.name.split(' ').pop() || '' : '',
                        prenom: user.name ? user.name.split(' ')[0] || '' : '',
                        email: user.email,
                        telephone: '',

                        // Initialize other fields to empty strings to avoid null issues in template
                        nomEntreprise: '',
                        siteWeb: '',
                        descriptionEntreprise: '',
                        adresseEntreprise: '',
                        poste: '',
                        linkedin: '',
                        twitter: '',
                        specialities: []
                    };
                    this.profileSubject.next(basicProfile);
                }
            });
        }
    }

    getProfile(): Observable<Recruiter> {
        return this.profileSubject.asObservable() as Observable<Recruiter>;
    }

    updateProfile(updatedProfile: Recruiter): Observable<Recruiter> {
        const user = this.authService.getCurrentUser();
        if (!user || !user.id) {
            throw new Error("No user logged in");
        }

        return this.apiService.put<Recruiter>(`recruteur/${user.id}`, updatedProfile).pipe(
            tap(profile => {
                this.profileSubject.next(profile);
                if (profile.photoUrl) {
                    this.profileImageSource.next(profile.photoUrl);
                }
            })
        );
    }

    createProfile(newProfile: Recruiter): Observable<Recruiter> {
        return this.apiService.post<Recruiter>(`recruteur`, newProfile).pipe(
            tap(profile => {
                this.profileSubject.next(profile);
            })
        );
    }

    promoteProfile(id: number, newProfile: Recruiter): Observable<Recruiter> {
        return this.apiService.put<Recruiter>(`recruteur/promote/${id}`, newProfile).pipe(
            tap(profile => {
                this.profileSubject.next(profile);
            })
        );
    }

    updateProfileImage(imageUrl: string) {
        const currentProfile = this.profileSubject.getValue();
        if (currentProfile) {
            const updatedProfile = { ...currentProfile, photoUrl: imageUrl };
            this.updateProfile(updatedProfile).subscribe();
        }
    }
}
