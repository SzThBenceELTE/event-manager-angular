import { Component, NgZone, OnInit } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { EventService } from '../../services/event/event.service';
import { PersonService } from '../../services/person/person.service';
import { EventTypeEnum } from '../../models/enums/event-type.enum';
import { RoleTypeEnum } from '../../models/enums/role-type.enum';
import { GroupTypeEnum } from '../../models/enums/group-type.enum';
import { PersonModel } from '../../models/person.model';
import { CommonModule } from '@angular/common';
import { Color } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { RealTimeService } from '../../services/real-time/real-time.service';
import { ExportService } from '../../services/export/export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [CommonModule,
    NgxChartsModule,
  ],
})
export class StatisticsComponent implements OnInit {
  totalEvents: number = 0;
  eventTypeCounts: { [key in EventTypeEnum]: number } = {
    [EventTypeEnum.MEETING]: 0,
    [EventTypeEnum.PRESENTATION]: 0,
    [EventTypeEnum.MEETUP]: 0,
  };

  allTotalEvents: number = 0;
  allEventTypeCounts: { [key in EventTypeEnum]: number } = {
    [EventTypeEnum.MEETING]: 0,
    [EventTypeEnum.PRESENTATION]: 0,
    [EventTypeEnum.MEETUP]: 0,
  };

  totalPersons: number = 0;
  roleCounts: { [key in RoleTypeEnum]: number } = {
    [RoleTypeEnum.MANAGER]: 0,
    [RoleTypeEnum.DEVELOPER]: 0,
  };
  groupCounts: { [key in GroupTypeEnum]: number } = {
    [GroupTypeEnum.RED]: 0,
    [GroupTypeEnum.GREEN]: 0,
    [GroupTypeEnum.YELLOW]: 0,
    [GroupTypeEnum.BLUE]: 0,
  };

  eventTypeData: { name: string; value: number }[] = [];
  allEventTypeData: { name: string; value: number }[] = [];

  
  roleData: { name: string; value: number }[] = [];
  groupData: { name: string; value: number }[] = [];

  colorScheme: Color = {
    name: 'eventTypeScheme',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    selectable: true,
    group: ScaleType.Ordinal,
  };

  groupsColorScheme: Color = {
    name: 'groupScheme',
    domain: ['#FF0000', '#00FF00', '#FFFF00', '#0000FF'],
    selectable: true,
    group: ScaleType.Ordinal,
  };

  defaultColor: string = '#CCCCCC';

  isDeveloper: boolean = false;

  constructor(
    private eventService: EventService,
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private realTimeService: RealTimeService,
    private ngZone: NgZone,
    private exportService: ExportService,
    private authService: AuthService
  ) {
    this.realTimeService.onRefresh((data) => {
      console.log('Refresh event received:', data);
      this.ngZone.run(() => {
        console.log('StatisticsComponent refresh initialized');
        this.loadEventStatistics();
        console.log('Event statistics loaded');
        this.loadPersonStatistics();
        console.log('Person statistics loaded');
      });
    });
  }

  ngOnInit() {
    console.log('StatisticsComponent initialized');
    this.loadEventStatistics();
    console.log('Event statistics loaded');
    this.loadPersonStatistics();
    console.log('Person statistics loaded');
    this.checkUserRole();
    console.log('User role checked');
  }

  checkUserRole(): void {
    this.authService.currentPerson$.subscribe((person: PersonModel | null) => {
      console.log('Current person:', person);
      if (person?.role === 'DEVELOPER') {
        this.isDeveloper = true;
      } else {
        this.isDeveloper = false;
      }
    });
  }

  loadEventStatistics() {
    this.eventService.getAllEvents().subscribe((events) => {
      this.totalEvents = events.length;
      console.log(events);
      // Initialize counts
      for (const type of Object.values(EventTypeEnum)) {
        this.eventTypeCounts[type] = 0;
      }

      events.forEach((event) => {
        if (event.type && this.eventTypeCounts.hasOwnProperty(event.type)) {
          this.eventTypeCounts[event.type]++;
          
        }
      });
      console.log(this.eventTypeCounts);
      this.eventTypeData = []; // Clear existing data
      this.eventTypeKeys().forEach((key) => {
        this.eventTypeData.push({ name: key.toString(), value: this.eventTypeCounts[key] });
      });
      // console.log(this.eventTypeCounts);
      console.log(this.eventTypeData);
    });

    this.eventService.getAllAndPastEvents().subscribe((events) => {
      this.allTotalEvents = events.length;
      console.log(events);
      // Initialize counts
      for (const type of Object.values(EventTypeEnum)) {
        this.allEventTypeCounts[type] = 0;
      }

      events.forEach((event) => {
        if (event.type && this.allEventTypeCounts.hasOwnProperty(event.type)) {
          this.allEventTypeCounts[event.type]++;
          
        }
      });
      console.log(this.allEventTypeCounts);
      this.allEventTypeData = []; // Clear existing data
      this.eventTypeKeys().forEach((key) => {
        this.allEventTypeData.push({ name: key.toString(), value: this.allEventTypeCounts[key] });
      });
      // console.log(this.eventTypeCounts);
      console.log(this.allEventTypeData);
    });

    
  }

  

  loadPersonStatistics() {
    this.personService.getPersons().subscribe((persons) => {
      this.totalPersons = persons.length;
      console.log(persons);

      for (const role of Object.values(RoleTypeEnum)) {
        this.roleCounts[role] = 0;
      }

      for (const group of Object.values(GroupTypeEnum)) {
        this.groupCounts[group] = 0;
      }
      

      console.log(this.roleCounts);
      console.log(this.groupCounts);

      persons.forEach((person : PersonModel) => {
        if (person.role && this.roleCounts.hasOwnProperty(person.role)) {
          this.roleCounts[person.role]++;
        }
        if (person.group && this.groupCounts.hasOwnProperty(person.group)) {
          this.groupCounts[person.group]++;
        }
        
      });
      console.log(this.roleCounts);

      this.roleData = []; // Clear existing data
      this.roleKeys().forEach((key) => {
        this.roleData.push({ name: key.toString(), value: this.roleCounts[key] });
      });
      console.log(this.roleData);
      
      this.groupData = []; // Clear existing data
      this.groupKeys().forEach((key) => {
        this.groupData.push({ name: key.toString(), value: this.groupCounts[key] });
      });
      console.log(this.groupData);
    });

    
  }

  eventTypeKeys(): EventTypeEnum[] {
    return Object.keys(this.eventTypeCounts) as EventTypeEnum[];;
  }

  roleKeys(): RoleTypeEnum[] {
    return Object.keys(this.roleCounts) as RoleTypeEnum[];
  }

  groupKeys(): GroupTypeEnum[] {
    return Object.keys(this.groupCounts) as GroupTypeEnum[];
  }

   // Optional: Define color functions if needed
   getEventTypeColor(name: string): string {
    return this.colorScheme.domain[
      this.eventTypeKeys().indexOf(name as EventTypeEnum)
    ] || this.defaultColor;
  }

  getRoleColor(name: string): string {
    return this.groupsColorScheme.domain[
      this.roleKeys().indexOf(name as RoleTypeEnum)
    ] || this.defaultColor;
  }

  getGroupColor(name: string): string {
    return this.groupsColorScheme.domain[
      this.groupKeys().indexOf(name as GroupTypeEnum)
    ] || this.defaultColor;
  }

  exportEvents(): void {
    this.exportService.exportEvents().subscribe({
      next: (response) => {
        // If your response includes the file data, you might handle it here
        // For example, create a blob and trigger a download:
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show success snackbar message
        this.snackBar.open('Events exported successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        // Show error snackbar message
        this.snackBar.open('Export failed. Please try again later.', 'Close', { duration: 3000 });
        console.error('Export error:', error);
      }
    });

  }

  exportPeople(): void {
    this.exportService.exportPeople().subscribe({
      next: (response) => {
        // If your response includes the file data, you might handle it here
        // For example, create a blob and trigger a download:
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'people.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show success snackbar message
        this.snackBar.open('Events exported successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        // Show error snackbar message
        this.snackBar.open('Export failed. Please try again later.', 'Close', { duration: 3000 });
        console.error('Export error:', error);
      }
    });
  }

  exportUsers(): void {
    this.exportService.exportUsers().subscribe({
      next: (response) => {
        // If your response includes the file data, you might handle it here
        // For example, create a blob and trigger a download:
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show success snackbar message
        this.snackBar.open('Events exported successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        // Show error snackbar message
        this.snackBar.open('Export failed. Please try again later.', 'Close', { duration: 3000 });
        console.error('Export error:', error);
      }
    });
  }

  exportTeams(): void {
    this.exportService.exportTeams().subscribe({
      next: (response) => {
        // If your response includes the file data, you might handle it here
        // For example, create a blob and trigger a download:
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teams.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show success snackbar message
        this.snackBar.open('Events exported successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        // Show error snackbar message
        this.snackBar.open('Export failed. Please try again later.', 'Close', { duration: 3000 });
        console.error('Export error:', error);
      }
    });
  }

  
}