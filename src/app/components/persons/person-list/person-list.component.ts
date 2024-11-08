import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/person/person.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PersonModel } from '../../../models/person.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './person-list.component.html',
//   styleUrls: ['./user-list.component.css',],
  standalone: true,
  imports: [CommonModule],
})
export class PersonListComponent implements OnInit {
  people: PersonModel[] = [];

  constructor(private personService: PersonService, private router: Router) {}

  ngOnInit() {
    this.personService.getPersons().subscribe((data: PersonModel[]) => {
      this.people = data;
    });
  }

  createPerson() {
    this.router.navigate(['/people/create']);
  }

  editPerson(id: number) {
    this.router.navigate([`/people/edit/${id}`]);
  }

  deletePerson(id: number) {
    this.personService.deletePerson(id).subscribe({
      next: (response) => {
        console.log('Person deleted successfully', response);
        this.people = this.people.filter((person) => person.id !== id);
      },
      error: (err) => {
        console.error('Person deletion failed', err);
      }
    });
  }

  




  

}