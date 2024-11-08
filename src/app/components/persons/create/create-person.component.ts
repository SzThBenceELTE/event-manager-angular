import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { PersonModel } from "../../../models/person.model";
import { PersonService } from "../../../services/person/person.service";
import { FormsModule } from '@angular/forms';
import { RoleTypeEnum } from "../../../models/enums/role-type.enum";
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";

@Component
({
    selector: 'create-person',
    templateUrl: './create-person.component.html',
    //styleUrls: ['./create-person.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class CreatePersonComponent
{
    roleTypes = Object.values(RoleTypeEnum);
    groupTypes = Object.values(GroupTypeEnum);

    constructor(private personService: PersonService, private router: Router) { }

    onSubmit(createPersonForm: any)
    {
        const { firstName, surname, role, group } = createPersonForm.value;
        
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


    
        // Create the person
        this.personService.createPerson({ firstName, surname, role, group }).subscribe({
            next: (response) => {
                console.log('Person created successfully', response);
                this.router.navigate(['/people']);
            },
            error: (err) => {
                console.error('Person creation failed', err);
            }
        });
    }
}