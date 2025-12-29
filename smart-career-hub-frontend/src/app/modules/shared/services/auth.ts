import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mode mock pour développement frontend uniquement
  private MOCK_MODE = true;

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<any> {
    if (this.MOCK_MODE) {
      // Simulation d'une connexion réussie après 1 seconde
      return of({
        user: {
          id: '1',
          email: email,
          name: email.split('@')[0],
          // Check specifically for roles - using French 'recruteur' as requested
          role: (email === 'admin@gmail.com' ? 'admin' : (email === 'recruteur@gmail.com' ? 'recruiter' : 'candidate')) as any
        },
        token: 'mock-token-' + Date.now()
      }).pipe(delay(1000));
    }
    // TODO: Quand le backend sera prêt, décommenter cette ligne
    // return this.apiService.post('auth/login', { email, password });
    return of({}).pipe(delay(1000));
  }

  register(userData: any): Observable<any> {
    if (this.MOCK_MODE) {
      // Simulation d'une inscription réussie après 1 seconde
      return of({
        user: {
          id: '1',
          email: userData.email,
          name: userData.fullName || userData.email.split('@')[0],
          role: 'candidate' as const
        },
        token: 'mock-token-' + Date.now()
      }).pipe(delay(1000));
    }
    // TODO: Quand le backend sera prêt, décommenter cette ligne
    // return this.apiService.post('auth/register', userData);
    return of({}).pipe(delay(1000));
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  setUser(user: User, token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error loading user from storage', e);
        }
      }
    }
  }
}
