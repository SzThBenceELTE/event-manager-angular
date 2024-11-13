import { Component } from "@angular/core";
import { EventTypeEnum } from "../../../models/enums/event-type.enum";
import { EventModel } from "../../../models/event.model";
import { FormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { EventService } from "../../../services/event/event.service";
import { Router } from "@angular/router";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepicker24HoursFaceComponent } from "ngx-material-timepicker/src/app/material-timepicker/components/timepicker-24-hours-face/ngx-material-timepicker-24-hours-face.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import {IgxTimePickerModule} from 'igniteui-angular';


@Component({
    selector: 'create-event',
    templateUrl: './create-event.component.html',
    //styleUrls: ['./create-event.component.css'],
    standalone: true,
    imports: [FormsModule, CommonModule, 
        MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSliderModule, MatFormFieldModule,IgxTimePickerModule,
        IgxTimePickerModule],
})
export class CreateEventComponent {
    eventTypes = Object.values(EventTypeEnum);
    formatLabel: (value: number) => string;

    startTime: string = '00:00';
    endTime: string = '23:59';

    constructor(public eventService: EventService, private router: Router) {
        this.formatLabel = (value: number) => {
            return value + '';
        }
     }

    onSubmit(createEventForm: any) {
        const { name, type, startDate, endDate, maxParticipants } = createEventForm.value;

         // Combine date and time for startDate and endDate
        const fullStartDate = new Date(startDate);
        const [startHour, startMinute] = this.startTime.split(':');
        fullStartDate.setHours(+startHour, +startMinute);

        const fullEndDate = new Date(endDate);
        const [endHour, endMinute] = this.endTime.split(':');
        fullEndDate.setHours(+endHour, +endMinute);

        console.log(name, type, startDate, endDate, maxParticipants);

        // Basic Validation Checks
        if (!name || !type || !startDate || !endDate || !maxParticipants) {
            console.error('Please fill all the fields');
            return;
        }

        if (fullStartDate > fullEndDate) {
            console.error('Start date cannot be after end date');
            return;
        }

        if (fullStartDate < new Date()) {
            console.error('Start date cannot be in the past');
            return;
        }

        // Create the event
        this.eventService.createEvent({ name, type, startDate: fullStartDate, endDate: fullEndDate, maxParticipants }).subscribe({
            next: (response) => {
                console.log('Event created successfully', response);
                this.router.navigate(['/events']);
            },
            error: (err) => {
                console.error('Event creation failed', err);
            }
        });
    }

}