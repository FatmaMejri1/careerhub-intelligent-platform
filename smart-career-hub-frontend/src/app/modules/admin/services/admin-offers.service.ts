import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api';

@Injectable({
    providedIn: 'root'
})
export class AdminOffersService {

    constructor(private apiService: ApiService) { }

    getAllOffers(): Observable<any[]> {
        return this.apiService.get('offre/admin');
    }

    updateStatus(offerId: string | number, status: string): Observable<any> {
        return this.apiService.patch(`offre/${offerId}/status?status=${status}`, {});
    }
}
