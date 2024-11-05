// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Change to your login API endpoint

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password })
      .pipe(
        tap(response => {
          // Save token or user info to local storage or state management
          localStorage.setItem('token', response.token); // Assuming your API returns a token
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }
}
