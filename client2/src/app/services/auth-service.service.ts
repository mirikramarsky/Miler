// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'https://miler.onrender.com';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    console.log(`Attempting login with username: ${username}`);
    console.log(`Attempting login with password: ${password}`);
    
    
    return this.http.post<{ token: string }>(`${this.API}/admin/login`, {
      username,
      password,
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // בדיקה פשוטה – אפשר להשתמש ב jwt-decode
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  }

  logout() {
    localStorage.removeItem('token');
  }
}
