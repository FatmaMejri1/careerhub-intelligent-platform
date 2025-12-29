import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
    providedIn: 'root'
})
export class RecruiterGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
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
