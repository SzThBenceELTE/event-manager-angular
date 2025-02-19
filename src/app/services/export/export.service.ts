import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject, NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service"; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = 'http://localhost:3000/api/export';
  private ngZone = inject(NgZone);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  exportUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users`, { headers, responseType: 'blob' as 'json' });
  }

  exportPeople(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/people`, { headers, responseType: 'blob' as 'json' });
  }

  exportEvents(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/events`, { headers, responseType: 'blob' as 'json' });
  }

  exportTeams(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/teams`, { headers, responseType: 'blob' as 'json' });
  }
}
