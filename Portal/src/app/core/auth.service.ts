import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable()
export class AuthService {
  private tokenKey = 'jwtToken';

  // Store token after login
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUserIdFromToken(): number | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // try common claim names
    const id = payload.nameid || payload.sub || payload.unique_name || payload.id;
    return id ? Number(id) : null;
  } catch {
    return null;
  }
}
}


