// edit-event.component.ts
import { Component, OnInit } from "@angular/core";
import { EventTypeEnum } from "../../../models/enums/event-type.enum";
import { EventService } from "../../../services/event/event.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'edit-event',
    templateUrl: './edit-event.component.html',
    //styleUrls: ['./edit-event.component.css'], // Ensure this line is uncommented
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        MatDatepickerModule, 
        MatNativeDateModule, 
        MatInputModule, 
        MatSliderModule, 
        MatFormFieldModule
    ],
})
export class EditEventComponent implements OnInit {
    eventTypes = Object.values(EventTypeEnum);
    id!: number;
    event: any;
    startTime: string = '';
    endTime: string = '';
    formatLabel: (value: number) => string;
    parentEvents: EventService[] = [];
    selectedFile: File | null = null;

    maxParticipants: number = 10; // Initialize with default or fetched value

    constructor(
        private eventService: EventService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.formatLabel = (value: number) => {
            return value.toString();
        }
    }

    ngOnInit() {
        this.id = Number(this.route.snapshot.params['id']);
        // Fetch existing event data by ID
        this.eventService.getEvent(this.id).subscribe({
            next: (data) => {
                console.log('Event data loaded successfully', data);
                this.event = data;
                this.startTime = this.formatTime(data.startDate);
                this.endTime = this.formatTime(data.endDate);
                this.maxParticipants = data.maxParticipants || 10;
                this.parentEvents = data.filter((event: { parentId: any; }) => !event.parentId);
            },
            error: (err) => {
                console.error('Failed to load event data', err);
                this.router.navigate(['/events']); // Redirect if event not found
            }
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
    
        if (input.files && input.files.length) {
          this.selectedFile = input.files[0];
        }
      }

    /**
     * Formats a Date object or ISO string to 'HH:MM' format.
     * @param date The date to format.
     * @returns The formatted time string.
     */
    private formatTime(date: string | Date): string {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0'); 
        console.log('hours:', hours);
        const minutes = d.getMinutes().toString().padStart(2, '0');
        console.log('minutes:', minutes);
        return `${hours}:${minutes}`;
    }

    onSubmit(editEventForm: any) {
        const { name, type, startDate, endDate } = editEventForm.value;

        // Validate all fields are filled, including startTime and endTime
        if (!name || !type || !startDate || !endDate || !this.maxParticipants || !this.startTime || !this.endTime) {
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

        // Update the event
        this.eventService.updateEvent(this.id, { 
            name, 
            type, 
            startDate: fullStartDate, 
            endDate: fullEndDate, 
            maxParticipants: this.maxParticipants 
        }).subscribe({
            next: () => {
                this.openSuccessSnackbar('Event updated successfully');
                this.router.navigate(['/events']);
            },
            error: (err) => {
                console.error('Event update failed', err);
                this.openErrorSnackbar('Failed to update event.');
            }
        });
    }

    /**
     * Opens an error snack-bar with customized styling and positioning.
     * @param message The error message to display.
     */
    private openErrorSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000, // Increased duration for better visibility
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