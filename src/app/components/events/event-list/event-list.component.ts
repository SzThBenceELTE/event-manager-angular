// event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventModel } from '../../../models/event.model';
import { EventTypeEnum } from '../../../models/enums/event-type.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    ConfirmationDialogComponent,
  ],
})
export class EventListComponent implements OnInit {
  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  paginatedEvents: EventModel[] = [];

  searchTerm: string = '';
  selectedEventType: EventTypeEnum | null = null;
  eventTypes: (EventTypeEnum | null)[] = [null, ...Object.values(EventTypeEnum)];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.calculatePagination();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.snackBar.open('Failed to load events.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const type = this.selectedEventType;

    this.filteredEvents = this.events.filter((event) => {
      const nameMatch = event.name.toLowerCase().includes(term);
      const typeMatch = type ? event.type === type : true;
      return nameMatch && typeMatch;
    });

    this.currentPage = 1;
    this.calculatePagination();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.selectedEventType = null;
    this.filteredEvents = this.events;
    this.currentPage = 1;
    this.calculatePagination();
  }

  createEvent(): void {
    this.router.navigate(['/events/create']);
  }

  editEvent(id: number): void {
    this.router.navigate([`/events/edit/${id}`]);
  }

  /**
   * Opens a confirmation dialog before deleting an event.
   * @param id The ID of the event to delete.
   */
  deleteEvent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this event?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.deleteEvent(id).subscribe({
          next: (response) => {
            this.snackBar.open('Event deleted successfully!', 'Close', {
              duration: 3000,
            });
            this.events = this.events.filter((event) => event.id !== id);
            this.filteredEvents = this.filteredEvents.filter((event) => event.id !== id);
            this.calculatePagination();
            this.onSearch(); // Re-apply filters after deletion
          },
          error: (err) => {
            console.error('Event deletion failed', err);
            this.snackBar.open('Failed to delete event.', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  // Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    this.paginatedEvents = this.filteredEvents.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginatedEvents = this.filteredEvents.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }
}