import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {
    constructor(private apiService: ApiService) { }

    getUsers(): Observable<any[]> {
        return this.apiService.get('utilisateur/admin/users');
    }

    updateStatus(userId: number, status: string): Observable<any> {
        return this.apiService.patch(`utilisateur/${userId}/statut`, { statut: status });
    }

    deleteUser(userId: number): Observable<any> {
        return this.apiService.delete(`utilisateur/${userId}`);
    }
}
