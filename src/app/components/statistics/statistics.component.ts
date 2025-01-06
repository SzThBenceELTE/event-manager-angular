import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EventService } from '../../services/event/event.service';
import { PersonService } from '../../services/person/person.service';
import { EventTypeEnum } from '../../models/enums/event-type.enum';
import { RoleTypeEnum } from '../../models/enums/role-type.enum';
import { GroupTypeEnum } from '../../models/enums/group-type.enum';
import { PersonModel } from '../../models/person.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
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
  roleData: { name: string; value: number }[] = [];
  groupData: { name: string; value: number }[] = [];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(
    private eventService: EventService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    console.log('StatisticsComponent initialized');
    this.loadEventStatistics();
    console.log('Event statistics loaded');
    this.loadPersonStatistics();
    console.log('Person statistics loaded');
  }

  loadEventStatistics() {
    this.eventService.getEvents().subscribe((events) => {
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
      this.eventTypeKeys().forEach((key) => {
        this.eventTypeData.push({ name: key.toString(), value: this.eventTypeCounts[key] });
      });
      // console.log(this.eventTypeCounts);
      console.log(this.eventTypeData);
    });

    
  }

  

  loadPersonStatistics() {
    this.personService.getPersons().subscribe((persons) => {
      this.totalPersons = persons.length;

      persons.forEach((person : PersonModel) => {
        if (person.role && this.roleCounts.hasOwnProperty(person.role)) {
          this.roleCounts[person.role]++;
        }
        if (person.group && this.groupCounts.hasOwnProperty(person.group)) {
          this.groupCounts[person.group]++;
        }
        
      });

      this.roleKeys().forEach((key) => {
        this.roleData.push({ name: key.toString(), value: this.roleCounts[key] });
      });
      console.log(this.roleData);
  
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
}