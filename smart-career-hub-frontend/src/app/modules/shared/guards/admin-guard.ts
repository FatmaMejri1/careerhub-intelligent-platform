import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // If on server, allow the route to proceed; the client will re-verify
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const currentUser = authService.getCurrentUser();

    if (authService.isAuthenticated() && currentUser?.role === 'admin') {
        return true;
    }

    // Redirect to login if not authenticated or not admin
    // Optionally redirect to candidate dashboard if logged in but not admin
    if (authService.isAuthenticated()) {
        router.navigate(['/candidate/dashboard']);
    } else {
        router.navigate(['/auth/login']);
    }

    return false;
};
