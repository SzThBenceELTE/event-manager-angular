import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EventModel } from '../../../models/event.model';
import { EventService } from '../../../services/event/event.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-subevent-dialog',
  templateUrl: './subevent-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ConfirmationDialogComponent, MatIconModule],
})
export class SubeventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SubeventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventModel,
    private eventService: EventService,
    private dialog: MatDialog,
    private router: Router
    
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  cloneSubevent(): void {
    this.dialogRef.close({ action: 'cloned' });
    this.router.navigate(['/events/clone', this.data.id ]);
  }

  editSubevent(): void {
    this.dialogRef.close({ action: 'edited' });
    this.router.navigate(['/events/edit', this.data.id]);
  }

  deleteSubevent(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this event?' },
      });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.deleteEvent(this.data.id).subscribe({
          next: () => {
            this.dialogRef.close({ action: 'edited' }); // Indicate that deletion was successful
          },
          error: (err) => {
            console.error('Error deleting subevent:', err);
            // Handle error appropriately, e.g., show a notification
          },
        });
      }
    });
  }
}