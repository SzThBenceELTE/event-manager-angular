// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Change to your login API endpoint

  constructor(private http: HttpClient, private router: Router) {}

  private loginTokenSubject = new BehaviorSubject<string | null>(null);

  setLoginToken(token: string | null) {
    this.loginTokenSubject.next(token);
  }

  getLoginToken(): Observable<string | null> {
    return this.loginTokenSubject.asObservable();
  }

  private usernameSubject = new BehaviorSubject<string | null>(null);

  setUsername(uname: string | null) {
    this.usernameSubject.next(uname);
  }

  getUsername(): Observable<string | null> {
    console.log('getUsername');
    console.log(this.usernameSubject.value);
    return this.usernameSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('loginToken', response.loginToken);
          localStorage.setItem('userName', username);

          this.setLoginToken(response.loginToken);
          this.setUsername(username);

          console.log('loginToken', response.loginToken);
          console.log('username', username);

        })
      );
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.router.navigate(['/login']); // Redirect to login page after logout
    
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loginToken'); // Check if loginToken exists
  }

  getName(): string | null {
    return localStorage.getItem('userName');
  }

  
}
