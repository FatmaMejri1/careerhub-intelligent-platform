import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecruiterProfileService {
    private profileImageSource = new BehaviorSubject<string | null>(localStorage.getItem('recruiter_photo'));
    profileImage$ = this.profileImageSource.asObservable();

    updateProfileImage(imageUrl: string) {
        localStorage.setItem('recruiter_photo', imageUrl);
        this.profileImageSource.next(imageUrl);
    }
}
