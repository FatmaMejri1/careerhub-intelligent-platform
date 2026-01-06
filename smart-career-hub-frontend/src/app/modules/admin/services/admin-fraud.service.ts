import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminFraudService {
    constructor(private apiService: ApiService) { }

    getAlerts(): Observable<any[]> {
        return this.apiService.get('admin/fraud/alerts');
    }

    resolveAlert(userId: number, action: 'Bloquer' | 'Ignorer'): Observable<any> {
        return this.apiService.post(`admin/fraud/resolve/${userId}?action=${action}`, {});
    }

    getAIAnalysis(userId: number): Observable<any> {
        return this.apiService.get(`admin/fraud/ai-analysis/${userId}`);
    }
}
