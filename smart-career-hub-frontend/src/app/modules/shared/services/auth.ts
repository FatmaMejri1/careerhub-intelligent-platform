import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api';

export interface User {
  id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  name?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<User>('auth/login', { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // We adapt the user object from the response if needed
          const user: User = {
            id: response.id || response.userId || '0', // Adjust based on actual backend response
            email: response.email || email,
            role: response.role,
            name: response.name || email.split('@')[0]
          };
          this.setUser(user, response.token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.apiService.post('auth/register', userData).pipe(
      tap((response: any) => {
        if (response && response.token) {
          const user: User = {
            id: response.id || response.userId || '0',
            email: response.email || userData.email,
            role: response.role || 'candidate', // Default to candidate
            name: response.name || userData.fullName
          };
          this.setUser(user, response.token);
        }
      })
    );
  }

  logout(): void {
    // We only remove the token, as we want to clear the session
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

  updateUser(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
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

