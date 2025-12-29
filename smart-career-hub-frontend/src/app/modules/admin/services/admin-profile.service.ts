import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminProfileService {
    private profileImageSource = new BehaviorSubject<string | null>(null);
    profileImage$ = this.profileImageSource.asObservable();

    updateProfileImage(imageUrl: string) {
        this.profileImageSource.next(imageUrl);
    }
}
