import { inject, Injectable, NgZone, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EventTypeEnum } from "../../models/enums/event-type.enum";
import { HttpParams } from '@angular/common/http';
import { EventModel } from "../../models/event.model";
//import { GroupModel } from "../../models/group.model";
import { GroupTypeEnum } from "../../models/enums/group-type.enum";
import { RealTimeService } from "../real-time/real-time.service";

@Injectable({
    providedIn: 'root'
})
export class EventService  {
    private apiUrl = 'http://localhost:3000/api/events';
    private ngZone = inject(NgZone);

    constructor(private http: HttpClient, private realTimeService: RealTimeService) {
        this.ngZone.runOutsideAngular(() => {
            this.realTimeService.onRefresh((data) => { 
              console.log('Refresh event received:', data);
              // Re-enter Angular zone when updating state or making HTTP calls
              this.ngZone.run(() => {
                this.getEvents().subscribe({
                  next: (events) => {
                    console.log('Refreshed events:', events);
                    // Update local state if needed
                  },
                  error: (err) => {
                    console.error('Error refreshing events:', err);
                  }
                });
              });
            });
          });
    }
    

    getEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(this.apiUrl);
    }

    getAllEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(`${this.apiUrl}/all`);
    }

    getAllAndPastEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(`${this.apiUrl}/allandpast`);
    }

    // getGroups(): Observable<GroupModel[]> {
    //     return this.http.get<GroupModel[]>(`${this.apiUrl}/groups`);
    //   }

    createEvent(eventData: FormData): Observable<any> {
        console.log(eventData);
        return this.http.post(this.apiUrl, eventData);
    }

    getEvent(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateEvent(id: number, eventData : FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, eventData);
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