// import { EventService } from '../../services/event/event.service';
// import {
//   Component,
//   OnInit, 
//   ChangeDetectionStrategy,
//   ViewChild,
//   TemplateRef,
// } from '@angular/core';
// import {
//   startOfDay,
//   endOfDay,
//   subDays,
//   addDays,
//   endOfMonth,
//   isSameDay,
//   isSameMonth,
//   addHours,
// } from 'date-fns';
// import { Subject } from 'rxjs';
// // import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {
//   CalendarEvent,
//   CalendarEventAction,
//   CalendarEventTimesChangedEvent,
//   CalendarView,
// } from 'angular-calendar';
// import { EventColor } from 'calendar-utils';

// const colors: Record<string, EventColor> = {
//   red: {
//     primary: '#ad2121',
//     secondary: '#FAE3E3',
//   },
//   blue: {
//     primary: '#1e90ff',
//     secondary: '#D1E8FF',
//   },
//   yellow: {
//     primary: '#e3bc08',
//     secondary: '#FDF1BA',
//   },
// };
// @Component({
//   selector: 'app-calendar',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   standalone: true,
//   imports: [],
//   templateUrl: './calendar.component.html',
//   styleUrl: './calendar.component.css'
// })
// export class CalendarComponent implements OnInit {
//   // @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
//   view: CalendarView = CalendarView.Month;
//   CalendarView = CalendarView;
//   viewDate: Date = new Date();
//   // modalData: {
//   //   action: string;
//   //   event: CalendarEvent;
//   // };

//   events: CalendarEvent[] = [];
//   refresh: Subject<any> = new Subject();




//   // constructor(private eventService: EventService, private modal: NgbModal) {}

//   // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
//   //   if (isSameMonth(date, this.viewDate)) {
//   //     if (
//   //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
//   //       events.length === 0
//   //     ) {
//   //       this.activeDayIsOpen = false;
//   //     } else {
//   //       this.activeDayIsOpen = true;
//   //     }
//   //     this.viewDate = date;
//   //   }
//   // }



//   ngOnInit(): void {
//     this.loadEvents();
//   }

//   loadEvents(): void {
//     this.eventService.getEvents().subscribe((events) => {
//       this.events = events.map(event => ({
//         start: new Date(event.startDate),
//         end: new Date(event.endDate),
//         title: event.name,
//         meta: {
//           //id: event.id,
//           ...event
//         }
//       }));
//       this.refresh.next(true);
//     });
//   }

// }
