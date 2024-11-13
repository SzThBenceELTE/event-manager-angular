import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventService } from "../../../services/event/event.service";
import { Router } from '@angular/router';
import { EventModel } from "../../../models/event.model";

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
//    styleUrls: ['./event-list.component.css'],
    standalone: true,
    imports: [CommonModule],
})
export class EventListComponent implements OnInit{
    events: EventModel[] = [];

    constructor(private eventService: EventService, private router: Router) {}

    ngOnInit() {
        this.eventService.getEvents().subscribe((data: EventModel[]) => {
            this.events = data;
        });
    }

    createEvent() {
        this.router.navigate(['/events/create']);
    }

    editEvent(id: number) {
        this.router.navigate([`/events/edit/${id}`]);
    }

    deleteEvent(id: number) {
        this.eventService.deleteEvent(id).subscribe({
            next: (response) => {
                console.log('Event deleted successfully', response);
                this.events = this.events.filter((event) => event.id !== id);
            },
            error: (err) => {
                console.error('Event deletion failed', err);
            }
        });
    }
    // event-list.component.ts
    // joinEvent(eventId: number) {
    //     //const personId = /* get the current person's ID */;
    //     this.eventService.joinEvent(eventId, personId).subscribe({
    //     next: (response) => {
    //         console.log(response);
    //         // Update UI accordingly
    //     },
    //     error: (err) => {
    //         console.error(err.error.message);
    //     },
    //     });
    // }
  
    // leaveEvent(eventId: number) {
    //     //const personId = /* get the current person's ID */;
    //     this.eventService.leaveEvent(eventId, personId).subscribe({
    //     next: (response) => {
    //         console.log(response);
    //         // Update UI accordingly
    //     },
    //     error: (err) => {
    //         console.error(err.error.message);
    //     },
    //     });
//   }

}