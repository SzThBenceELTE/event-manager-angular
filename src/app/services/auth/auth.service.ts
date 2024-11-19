// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PersonModel } from '../../models/person.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Change to your login API endpoint

  private currentPerson: PersonModel | null = null;
  private tokenKey = 'loginToken';

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

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('loginToken', response.token);
        })
      );
  }

  // // Add method to get the token
  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  logout() {
    localStorage.removeItem('loginToken');
    this.router.navigate(['/login']); // Redirect to login page after logout
    
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR context, localStorage isn't available
    }
    return !!localStorage.getItem('loginToken');
  }

  getName(): string | null {
    if (typeof window === 'undefined') {
      return ""; // SSR context, localStorage isn't available
    }
    return localStorage.getItem('userName');
  }

  setCurrentPerson(person: PersonModel): void {
    this.currentPerson = person;
    // Optionally, store in localStorage/sessionStorage for persistence
    localStorage.setItem('currentPerson', JSON.stringify(person));
  }

  getCurrentPerson(): PersonModel | null {
    // If currentPerson is not set, try to get it from localStorage
    if (!this.currentPerson) {
      const personString = localStorage.getItem('currentPerson');
      if (personString) {
        this.currentPerson = JSON.parse(personString);
      }
    }
    return this.currentPerson;
  }

  // Clear user data on logout
  clearCurrentPerson(): void {
    this.currentPerson = null;
    localStorage.removeItem('currentPerson');
  }

  // Store the token (call this after successful login)
  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve the token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove the token (call this on logout)
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }
  
}
