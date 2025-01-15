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
//import { GroupService } from '../../../services/group/group.service'; // Import GroupService
//import { GroupModel } from '../../../models/group.model'; // Import GroupModel
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";

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
    availableGroups = Object.values(GroupTypeEnum);
    formatLabel: (value: number) => string;

    maxParticipants: number = 10; // Default value set to 10
    startTime: string = '00:00';
    endTime: string = '23:59';
    parentEvents: EventModel[] = [];
    selectedGroups: GroupTypeEnum[] = []; // Hold selected group IDs
    formSubmitted: boolean = false;
    selectedFile: File | null = null;
    imagePreviewUrl: string | ArrayBuffer | null = null;

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
        private snackBar: MatSnackBar,
        //private groupService: GroupService // Inject GroupService
    ) {
        this.formatLabel = (value: number) => {
            return value.toString();
        }
    }

    ngOnInit() {
        this.loadParentEvents();
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

    onSubmit(createEventForm: any): void {
        
        const { name, type, startDate, endDate, maxParticipants } = createEventForm.value;
        this.formSubmitted = true;
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

        // Create FormData and append fields
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

        // Append groups if any
        if (this.selectedGroups && this.selectedGroups.length > 0) {
            this.selectedGroups.forEach((group) => {
              formData.append('groups', group);
            });
          }

        // Call the service method
        this.eventService.createEvent(formData).subscribe({
            next: () => {
            this.openSuccessSnackbar('Event created successfully!');
            this.router.navigate(['/events']);
            },
            error: (err) => {
            this.openErrorSnackbar('Failed to create event. ' + err.error.message);
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