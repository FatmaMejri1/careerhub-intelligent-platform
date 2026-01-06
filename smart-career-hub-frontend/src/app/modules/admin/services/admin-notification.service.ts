import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminNotificationService {
    constructor(private apiService: ApiService) { }

    getNotifications(adminId: number): Observable<any[]> {
        return this.apiService.get(`admin/${adminId}/notifications`);
    }

    sendNotification(adminId: number, notification: any): Observable<any> {
        return this.apiService.post(`admin/${adminId}/notifications`, notification);
    }
}
