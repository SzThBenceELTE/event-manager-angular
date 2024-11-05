import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:3000/api/events';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    createEvent(event: { name: string; email: string }): Observable<any> {
        return this.http.post(this.apiUrl, event);
    }

    getEvent(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateEvent(id: number, event: { name: string; email: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, event);
    }

    deleteEvent(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}