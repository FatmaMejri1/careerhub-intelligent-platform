import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminStatsService {
    constructor(private apiService: ApiService) { }

    getAdminStats(): Observable<any> {
        return this.apiService.get('stats/admin');
    }
}
