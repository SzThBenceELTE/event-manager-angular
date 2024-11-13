import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EventTypeEnum } from "../../models/enums/event-type.enum";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:3000/api/events';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    createEvent(event: { name: string; type: EventTypeEnum; startDate: Date; endDate: Date; maxParticipants: number }): Observable<any> {
        return this.http.post(this.apiUrl, event);
    }

    getEvent(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateEvent(id: number, event: { name: string; type: EventTypeEnum; startDate: Date; endDate: Date; maxParticipants: number }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, event);
    }

    deleteEvent(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    joinEvent(eventId: number, personId: number) {
        return this.http.post('/api/events/join', { eventId, personId });
    }
      
    leaveEvent(eventId: number, personId: number) {
        return this.http.post('/api/events/leave', { eventId, personId });
    }
}