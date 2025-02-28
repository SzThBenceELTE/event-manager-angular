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
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";
import { EventModel } from "../../../models/event.model";

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
    availableGroups = Object.values(GroupTypeEnum);
    id!: number;
    event: any;
    name: string = '';
    type: EventTypeEnum = EventTypeEnum.MEETING;
    startTime: string = '';
    endTime: string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    formatLabel: (value: number) => string;
    parentEvents: EventModel[] = [];
    selectedFile: File | null = null;
    selectedGroups: GroupTypeEnum[] = []; // Hold selected group IDs
    currentParticipants: number = 0; // Initialize with default or fetched value
    maxParticipants: number = 10; // Initialize with default or fetched value
    parentId: number | undefined = undefined; // Initialize parentId
    imagePreviewUrl: string | ArrayBuffer | null = null;

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
        this.loadParentEvents();
        this.eventService.getEvent(this.id).subscribe({
            next: (data) => {
                console.log('Event data loaded successfully', data);
                this.event = data;
                this.id = data.id;
                this.name = data.name || '';
                this.type = data.type || EventTypeEnum.MEETING;
                this.startTime = this.formatTime(data.startDate);
                this.endTime = this.formatTime(data.endDate);
                this.maxParticipants = data.maxParticipants || 10;
                this.currentParticipants = data.currentParticipants || 0;
                //this.parentEvents = data.filter((event: { parentId: any; }) => !event.parentId);
                this.setSelectedGroups(data.groups);
                this.parentId = data.parentId;

            },
            error: (err) => {
                console.error('Failed to load event data', err);
                this.router.navigate(['/events']); // Redirect if event not found
            }
        });
    }

    setSelectedGroups(groups: GroupTypeEnum[]): void {
        for (const group of groups) {
            this.selectedGroups.push(group);
        }
        console.log('Selected groups:', this.selectedGroups);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
    
        if (input.files && input.files.length) {
            const file = input.files[0];
            const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
    
            if (file.size > maxSizeInBytes) {
                this.openErrorSnackbar('Image size must not exceed 2 MB');
                // Optionally, you can also reset the file input control here.
                return;
              }

            this.selectedFile = file;
    
            // Create a FileReader to load the file and set the preview URL
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreviewUrl = reader.result;
            };
            reader.readAsDataURL(this.selectedFile);
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

    onGroupChange(event: any, group: GroupTypeEnum): void {
        if (event.target.checked) {
            this.selectedGroups.push(group);
        } else {
            this.selectedGroups = this.selectedGroups.filter(g => g !== group);
        }
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

    onSubmit(editEventForm: any) {
        const { name, type, startDate, endDate, maxParticipants } = editEventForm.value;
        console.log('name', name);
        console.log('type', type);
        console.log('startDate', startDate);
        console.log('endDate', endDate);
        console.log('maxParticipants', maxParticipants);

        // Validate all fields are filled, including startDate and endDate
        if (!name || !type || !startDate || !endDate || !maxParticipants || !this.startDate || !this.endDate) {
            this.openErrorSnackbar('Please fill out all fields');
            return;
        }

        // Parse startDate and endDate
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

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('startDate', fullStartDate.toISOString());
        formData.append('endDate', fullEndDate.toISOString());
        formData.append('maxParticipants', maxParticipants.toString());
        
        // Append image file
        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        // Append parentId if exists
        if (this.event.parentId) {
            formData.append('parentId', this.event.parentId.toString());
        }
        
        console.log('selectedGroups', this.selectedGroups);
        if (this.selectedGroups && this.selectedGroups.length > 0) {
            this.selectedGroups.forEach((group) => {
              formData.append('groups', group);
            });
          }

        // console.log('formData', formData.get('name'));
        // console.log('formData', formData.get('type'));
        // console.log('formData', formData.get('startDate'));
        // console.log('formData', formData.get('endDate'));
        // console.log('formData', formData.get('maxParticipants'));
        // console.log('formData', formData.get('image'));
        // console.log('formData', formData.get('groups'));

        // Update the event
        this.eventService.updateEvent(this.id, formData).subscribe({
            next: () => {
                this.openSuccessSnackbar('Event updated successfully');
                this.router.navigate(['/events']);
            },
            error: (err) => {
                console.error('Event update failed', err);
                this.openErrorSnackbar('Failed to update event. ' + err.error.message);
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

    decrement() {
        if (this.maxParticipants > 1) {
            this.maxParticipants--;
        }
    }

    increment() {
        if (this.maxParticipants < 300) {
            this.maxParticipants++;
        }
    }
}