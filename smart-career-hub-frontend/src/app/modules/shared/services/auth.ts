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

  private normalizeRole(role: string): any {
    if (!role) return 'candidate';
    const r = role.toUpperCase();
    if (r.includes('ADMIN')) return 'admin';
    if (r.includes('RECRUTEUR') || r.includes('RECRUITER')) return 'recruiter';
    return 'candidate';
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<User>('auth/login', { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          const user: User = {
            id: response.id || response.userId || '0',
            email: response.email || email,
            role: this.normalizeRole(response.role),
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
            role: this.normalizeRole(response.role),
            name: response.name || userData.fullName
          };
          this.setUser(user, response.token);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.deleteCookie('authToken');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  setUser(user: User, token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.setCookie('authToken', token, 7);
    }
    this.currentUserSubject.next(user);
  }

  updateUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || this.getCookie('authToken');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string) {
    this.setCookie(name, "", -1);
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined') {
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

