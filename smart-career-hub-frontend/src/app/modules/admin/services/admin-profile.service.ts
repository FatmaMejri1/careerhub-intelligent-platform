import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

    uploadPhoto(file: File): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            const formData = new FormData();
            formData.append('file', file);
            // Assuming ApiService handles FormData correctly (does not force JSON)
            // If ApiService forces JSON, we might need to use http client directly
            return this.apiService.post(`admin/${user.id}/photo`, formData);
        }
        return of(null);
    }

    getProfile(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            return this.apiService.get(`admin/${user.id}`).pipe(
                map((data: any) => {
                    if (data && data.profileImage && !data.profileImage.startsWith('http') && !data.profileImage.startsWith('data:')) {
                        data.profileImage = `http://localhost:9099${data.profileImage}`;
                    }
                    return data;
                })
            );
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
