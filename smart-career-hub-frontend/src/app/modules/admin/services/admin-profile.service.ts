import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from '../../shared/services/api';
import { AuthService } from '../../shared/services/auth';

@Injectable({
    providedIn: 'root'
})
export class AdminProfileService {
    private profileImageSource = new BehaviorSubject<string | null>(null);
    profileImage$ = this.profileImageSource.asObservable();

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    updateProfileImage(imageUrl: string) {
        this.profileImageSource.next(imageUrl);
    }

    getProfile(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            return this.apiService.get(`admin/${user.id}`);
        }
        return of(null);
    }

    updateProfile(data: any): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            return this.apiService.put(`admin/${user.id}/profile`, data);
        }
        return of(null);
    }
}
