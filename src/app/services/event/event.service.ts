import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EventTypeEnum } from "../../models/enums/event-type.enum";
import { HttpParams } from '@angular/common/http';
import { EventModel } from "../../models/event.model";
//import { GroupModel } from "../../models/group.model";
import { GroupTypeEnum } from "../../models/enums/group-type.enum";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:3000/api/events';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(this.apiUrl);
    }

    // getGroups(): Observable<GroupModel[]> {
    //     return this.http.get<GroupModel[]>(`${this.apiUrl}/groups`);
    //   }

    createEvent(event: { name: string; type: EventTypeEnum; startDate: Date; endDate: Date; maxParticipants: number; parentId: number | undefined; groups: GroupTypeEnum[] }): Observable<any> {
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

    joinEvent(eventId: number, personId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/join`, { eventId, personId });
    }
      
    leaveEvent(eventId: number, personId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/leave`, { eventId, personId });
    }
    getParentEvents(): Observable<EventModel[]> {
        const params = new HttpParams().set('parentId', 'null');
        return this.http.get<EventModel[]>(this.apiUrl, { params });
    }
}