import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const candidateGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    if (authService.isAuthenticated() && currentUser?.role === 'candidate') {
        return true;
    }

    if (authService.isAuthenticated()) {
        if (currentUser?.role === 'admin') {
            router.navigate(['/admin']);
        } else if (currentUser?.role === 'recruiter') {
            router.navigate(['/recruiter']);
        } else {
            router.navigate(['/']);
        }
    } else {
        router.navigate(['/auth/login']);
    }

    return false;
};
