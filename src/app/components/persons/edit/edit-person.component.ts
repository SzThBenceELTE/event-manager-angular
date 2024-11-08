import { Component, OnInit } from "@angular/core";
import { PersonService } from "../../../services/person/person.service";
import { RoleTypeEnum } from "../../../models/enums/role-type.enum";
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';



@Component({
    selector: 'edit-person',
    templateUrl: './edit-person.component.html',
    //styleUrls: ['./edit-person.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
    })
export class EditPersonComponent implements OnInit {

    roleTypes = Object.values(RoleTypeEnum);
    groupTypes = Object.values(GroupTypeEnum);
    id!: number;
    person: any;

    constructor(private personService: PersonService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        // Fetch existing person data by ID
        this.personService.getPerson(this.id).subscribe({
            next: (data) => {
                this.person = data;
            },
            error: (err) => {
                console.error('Failed to load person data', err);
                this.router.navigate(['/people']); // Redirect if person not found
            }
        });
    }

    onSubmit(editPersonForm: any)
    {
        const { firstName, surname, role, group } = editPersonForm.value;
        
        console.log(firstName, surname, role, group);
        

        // Basic Validation Checks
        if (!firstName || !surname || !role) {
            console.error('Please fill all the fields');
            return;
        }

        if ((role == RoleTypeEnum.DEVELOPER) && !group) {
            console.error('Please select a group for the developer');
            return;
        }


        console.log(firstName, surname, role, group);

        this.personService.updatePerson(this.id , { firstName, surname, role, group }).subscribe({
            next: (response) => {
                console.log('Person updated successfully', response);
                this.router.navigate(['/people']);
            },
            error: (err) => {
                console.error('Person update failed', err);
            }
        });
    }
}