// clone-event.component.ts
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
    selector: 'clone-event',
    templateUrl: './clone-event.component.html',
    // Uncomment styleUrls if needed
    // styleUrls: ['./edit-event.component.css'],
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
//this is actually just a subevent creator, not a clone function anymore
export class CloneEventComponent implements OnInit {
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
    // New property to hold the preview URL
    imagePreviewUrl: string | ArrayBuffer | null = null;
    selectedGroups: GroupTypeEnum[] = [];
    allGroups: GroupTypeEnum[] = [];
    currentParticipants: number = 0;
    maxParticipants: number = 10;
    parentId: number | undefined = undefined;
    parentParticipants: number = 0;

    constructor(
        private eventService: EventService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.formatLabel = (value: number) => value.toString();
    }

    ngOnInit() {
        this.id = Number(this.route.snapshot.params['id']);
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
                this.setSelectedGroups(data.groups);
                this.parentId = data.parentId;
                console.log("Parent id:", this.id);

                // In your clone, you might want to use the current event as the parent event.
                this.event.parentId = this.id;
                this.parentParticipants = data.maxParticipants;
            },
            error: (err) => {
                console.error('Failed to load event data', err);
                this.router.navigate(['/events']);
            }
        });
    }

    setSelectedGroups(groups: GroupTypeEnum[]): void {
        for (const group of groups) {
            this.selectedGroups.push(group);
            this.allGroups.push(group);
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

    onSubmit(cloneEventForm: any) {
        const { name, type, startDate, endDate, maxParticipants } = cloneEventForm.value;
        console.log('name', name);
        console.log('type', type);
        console.log('startDate', startDate);
        console.log('endDate', endDate);
        console.log('maxParticipants', maxParticipants);

        // Validate required fields
        if (!name || !type || !startDate || !endDate || !maxParticipants || !this.startDate || !this.endDate) {
            this.openErrorSnackbar('Please fill out all fields');
            return;
        }

        // Parse startTime and endTime
        const [startHour, startMinute] = this.startTime.split(':').map(Number);
        const [endHour, endMinute] = this.endTime.split(':').map(Number);

        const fullStartDate = new Date(startDate);
        fullStartDate.setHours(startHour, startMinute, 0, 0);

        const fullEndDate = new Date(endDate);
        fullEndDate.setHours(endHour, endMinute, 0, 0);

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
        
        // Append image file if selected
        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        // Append parentId if exists
        if (this.event.parentId) {
            formData.append('parentId', this.event.parentId.toString());
        }
        
        // Append groups if any are selected
        if (this.selectedGroups && this.selectedGroups.length > 0) {
            this.selectedGroups.forEach((group) => {
              formData.append('groups', group);
            });
        }

        // Call backend createEvent method
        this.eventService.createEvent(formData).subscribe({
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

    private openErrorSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['custom-snackbar', 'error-snackbar'],
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
    }

    private openSuccessSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar', 'success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    decrement() {
        let max = this.getParentParticipants();
        console.log("Max participants: ", max);
        if (this.maxParticipants > 1) {
            if (this.maxParticipants > max) {
                this.maxParticipants = max;
            } else {
                this.maxParticipants--;
            }
        }
    }

    increment() {
        let max = this.getParentParticipants();
        console.log("Max participants: ", max);
        if (this.maxParticipants < max) {
            this.maxParticipants++;
        }
    }

    getParentParticipants(): number {
        return this.parentParticipants;
    }

    getNeededGroups(): GroupTypeEnum[] {
        return this.allGroups;
    }

    getStartTime(): string {
        return this.startTime;
    }
}
