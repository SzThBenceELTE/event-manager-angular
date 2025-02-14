import { inject, Injectable, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PersonModel } from "../../models/person.model";
import { RoleTypeEnum } from "../../models/enums/role-type.enum";
import { GroupTypeEnum } from "../../models/enums/group-type.enum";
import { RealTimeService } from "../real-time/real-time.service";

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private apiUrl = 'http://localhost:3000/api/people';
    private ngZone = inject(NgZone);

    constructor(private http: HttpClient,  private realTimeService: RealTimeService) {
        this.ngZone.runOutsideAngular(() => {
            this.realTimeService.onRefresh((data) => { 
              console.log('Refresh event received:', data);
              // Re-enter Angular zone when updating state or making HTTP calls
              this.ngZone.run(() => {
                this.getPersons().subscribe({
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

    getPersons(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    createPerson(person: { firstName: string; surname: string; role: RoleTypeEnum; group: GroupTypeEnum | undefined }): Observable<any> {
        return this.http.post(this.apiUrl, person);
    }

    getPerson(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updatePerson(id: number, person: { firstName: string; surname: string; role: RoleTypeEnum; group: GroupTypeEnum | undefined }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, person);
    }

    deletePerson(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}