// create-event.component.ts
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { IgxTimePickerModule } from 'igniteui-angular';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'create-event',
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSliderModule,
        MatFormFieldModule,
        IgxTimePickerModule
    ],
})
export class CreateEventComponent {
    eventTypes = Object.values(EventTypeEnum);
    formatLabel: (value: number) => string;

    maxParticipants: number = 10; // Default value set to 10
    startTime: string = '00:00';
    endTime: string = '23:59';
    parentEvents: EventModel[] = [];

    event: EventModel = {
        id: 0,
        name: '',
        type: EventTypeEnum.MEETING,
        startDate: new Date(),
        endDate: new Date(),
        maxParticipants: 10,
        currentParticipants: 0,
        parentId: undefined, // Initialize parentId
    };

    constructor(
        public eventService: EventService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.formatLabel = (value: number) => {
            return value.toString();
        }
    }

    ngOnInit() {
        this.loadParentEvents();
    }

    loadParentEvents(): void {
        this.eventService.getEvents().subscribe({
          next: (events) => {
            // Exclude subevents to prevent circular references
            this.parentEvents = events.filter((event: EventModel) => event.parentId == null);
          },
          error: (err) => {
            console.error('Error fetching parent events:', err);
          },
        });
      }

    onSubmit(createEventForm: any): void {
        const { name, type, startDate, endDate, maxParticipants } = createEventForm.value;

        // Validate all fields are filled, including startTime and endTime
        if (!name || !type || !startDate || !endDate || !maxParticipants || !this.startTime || !this.endTime) {
            this.openErrorSnackbar('Please fill out all fields');
            return;
        }

        // Parse startTime and endTime
        const [startHour, startMinute] = this.startTime.split(':').map(Number);
        const [endHour, endMinute] = this.endTime.split(':').map(Number);

        // Create Date objects from startDate and endDate
        const fullStartDate = new Date(startDate);
        fullStartDate.setHours(startHour, startMinute, 0, 0); // Set hours and minutes

        const fullEndDate = new Date(endDate);
        fullEndDate.setHours(endHour, endMinute, 0, 0); // Set hours and minutes


        // Validate date logic
        if (fullStartDate > fullEndDate) {
            this.openErrorSnackbar('Start date and time cannot be after end date and time');
            return;
        }

        if (fullStartDate < new Date()) {
            this.openErrorSnackbar('Start date and time cannot be in the past');
            return;
        }

        // Calculate duration in hours
        const duration = (fullEndDate.getTime() - fullStartDate.getTime()) / 1000 / 60 / 60;

        // Duration validations based on event type
        if (type === EventTypeEnum.MEETING && duration > 3) {
            this.openErrorSnackbar('Meetings cannot be longer than 3 hours');
            return;
        }
        if (type === EventTypeEnum.MEETING && duration > 2) {
            this.openErrorSnackbar('Meetings cannot be longer than 2 hours');
            return;
        }
        if (type === EventTypeEnum.MEETUP && duration > 8) {
            this.openErrorSnackbar('Meetups cannot be longer than 8 hours');
            return;
        }

        // Create the event
        this.eventService.createEvent({ 
            name, 
            type, 
            startDate: fullStartDate, 
            endDate: fullEndDate, 
            maxParticipants,
            parentId: this.event.parentId
        }).subscribe({
            next: () => {
                this.openSuccessSnackbar('Event created successfully!');
                this.router.navigate(['/events']);
            },
            error: (err) => {
                this.openErrorSnackbar('Failed to create event.');
                console.error('Event creation failed', err);
            },
        });
    }

    /**
     * Opens an error snack-bar with customized styling and positioning.
     * @param message The error message to display.
     */
    private openErrorSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['custom-snackbar', 'error-snackbar'],
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
    }

    /**
     * Opens a success snack-bar with customized styling and positioning.
     * @param message The success message to display.
     */
    private openSuccessSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar', 'success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }
}