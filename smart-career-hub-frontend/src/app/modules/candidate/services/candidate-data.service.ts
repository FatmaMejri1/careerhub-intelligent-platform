import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CandidateDataService {
    private userPhotoSubject = new BehaviorSubject<string | ArrayBuffer | null>(null);
    userPhoto$ = this.userPhotoSubject.asObservable();

    constructor() { }

    updatePhoto(photo: string | ArrayBuffer | null) {
        this.userPhotoSubject.next(photo);
    }
}
