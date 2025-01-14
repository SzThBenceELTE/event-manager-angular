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
import { AuthService } from '../../../services/auth/auth.service';
import { PersonModel } from '../../../models/person.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { SubeventDialogComponent } from '../subevent-dialog/subevent-dialog.conponent';
import { MatIconModule } from '@angular/material/icon';


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
    MatProgressSpinnerModule,
    SubeventDialogComponent,
    MatIconModule,
  ],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [style({ opacity: 0 })],
          { optional: true }
        ),
        query(
          ':enter',
          [
            stagger('100ms', [
              animate(
                '600ms ease-in',
                style({ opacity: 1 })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
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

  isDeveloper: boolean = false;

  loading: boolean = true;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchEvents();
    this.checkUserRole();
  }

  fetchEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.calculatePagination();
        this.checkIfLoadingComplete();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.snackBar.open('Failed to load events.', 'Close', {
          duration: 3000,
        });
        this.checkIfLoadingComplete();
      },
    });
  }

  checkUserRole(): void {
    this.authService.currentPerson$.subscribe((person: PersonModel | null) => {
      console.log('Current person:', person);
      if (person?.role === 'DEVELOPER') {
        this.isDeveloper = true;
      } else {
        this.isDeveloper = false;
      }
      this.checkIfLoadingComplete();
    });
  }

  private loadingTasksCompleted: boolean = false;

  private checkIfLoadingComplete(): void {
    if (!this.loadingTasksCompleted) {
      this.loadingTasksCompleted = true;
      this.loading = false;
    }
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

  cloneEvent(id: number): void {
    this.router.navigate([`/events/clone/${id}`]);
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

  openSubeventDialog(subevent: EventModel): void {
    console.log('Subevent Data:', subevent); // Debugging line
    const dialogRef = this.dialog.open(SubeventDialogComponent, {
      width: '400px',
      data: subevent,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edited' || result?.action === 'deleted') {
        this.fetchEvents();
      }
    });
  }

  
}