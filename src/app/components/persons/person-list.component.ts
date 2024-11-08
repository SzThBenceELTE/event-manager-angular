import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person/person.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './person-list.component.html',
//   styleUrls: ['./user-list.component.css',],
  standalone: true,
  imports: [CommonModule],
})
export class PersonListComponent implements OnInit {
  people: any[] = [];

  constructor(private personService: PersonService, private router: Router) {}

  ngOnInit() {
    this.personService.getPersons().subscribe((data) => {
      this.people = data;
    });
  }


  

}