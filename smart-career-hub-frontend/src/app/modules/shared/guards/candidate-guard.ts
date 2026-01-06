import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

export const candidateGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

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
