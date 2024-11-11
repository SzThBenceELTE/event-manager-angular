import { Component } from "@angular/core";
import { EventTypeEnum } from "../../../models/enums/event-type.enum";
import { EventService } from "../../../services/event/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepicker24HoursFaceComponent } from "ngx-material-timepicker/src/app/material-timepicker/components/timepicker-24-hours-face/ngx-material-timepicker-24-hours-face.component";
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'edit-event',
    templateUrl: './edit-event.component.html',
    //styleUrls: ['./edit-event.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSliderModule, MatFormFieldModule],
})
export class EditEventComponent {

    eventTypes = Object.values(EventTypeEnum);
    id!: number;
    event: any;
formatLabel: (value: number) => string;

    constructor(private eventService: EventService, private router: Router, private route: ActivatedRoute) {
        this.formatLabel = (value: number) => {
            return value + '';
        }
     }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        // Fetch existing event data by ID
        this.eventService.getEvent(this.id).subscribe({
            next: (data) => {
                this.event = data;
            },
            error: (err) => {
                console.error('Failed to load event data', err);
                this.router.navigate(['/events']); // Redirect if event not found
            }
        });
    }

    onSubmit(editEventForm: any) {
        const { name, type, startDate, endDate, maxParticipants } = editEventForm.value;

        console.log(name, type, startDate, endDate, maxParticipants);

        // Basic Validation Checks
        if (!name || !type || !startDate || !endDate || !maxParticipants) {
            console.error('Please fill all the fields');
            return;
        }

        if (startDate > endDate) {
            console.error('Start date cannot be after end date');
            return;
        }

        if (startDate < new Date()) {
            console.error('Start date cannot be in the past');
            return;
        }

        // Update the event
        this.eventService.updateEvent(this.id, { name, type, startDate, endDate, maxParticipants }).subscribe({
            next: (response) => {
                console.log('Event updated successfully', response);
                this.router.navigate(['/events']);
            },
            error: (err) => {
                console.error('Event update failed', err);
            }
        });
    }
}