import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from '../../shared/services/api';
import { AuthService } from '../../shared/services/auth';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CandidateDataService {
    private userPhotoSubject = new BehaviorSubject<string | ArrayBuffer | null>(null);
    userPhoto$ = this.userPhotoSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    updatePhoto(photo: string | ArrayBuffer | null) {
        this.userPhotoSubject.next(photo);
    }

    getProfile(): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            return this.apiService.get(`chercheur/${user.id}`);
        }
        return of(null);
    }

    updateProfile(data: any): Observable<any> {
        const user = this.authService.getCurrentUser();
        if (user && user.id) {
            return this.apiService.put(`chercheur/${user.id}`, data);
        }
        return of(null);
    }
}
