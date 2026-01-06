import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class RecruiterGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: any
    ) { }

    canActivate(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        const user = this.authService.getCurrentUser();

        // Check if user is logged in
        if (!this.authService.isAuthenticated() || !user) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        // Check if user has recruiter role
        if (user.role === 'recruiter') {
            return true;
        }

        // Redirect if not authorized
        alert('Access Denied: Recruiter Only');
        this.router.navigate(['/']);
        return false;
    }
}
