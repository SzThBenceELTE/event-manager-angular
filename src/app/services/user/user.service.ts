import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RealTimeService } from '../real-time/real-time.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Node.js API endpoint
  private ngZone = inject(NgZone);

  constructor(private http: HttpClient, private realTimeService: RealTimeService) {
    this.ngZone.runOutsideAngular(() => {
      this.realTimeService.onRefresh((data) => {
        console.log('Refresh event received:', data);
        // Re-enter Angular zone when updating state or making HTTP calls
        this.ngZone.run(() => {
          this.getUsers().subscribe({
            next: (users) => {
              console.log('Refreshed users:', users);
              // Update local state if needed
            },
            error: (err) => {
              console.error('Error refreshing users:', err);
            }
          });
        });
      });
    });
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }
 
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}`);
  }

  updateUser(id: number, user: { name: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}