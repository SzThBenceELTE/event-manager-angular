import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EventModel } from '../../../models/event.model';

@Component({
  selector: 'app-subevent-dialog',
  templateUrl: './subevent-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
})
export class SubeventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SubeventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventModel
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}