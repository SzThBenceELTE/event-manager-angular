import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { PersonModel } from "../../../models/person.model";
import { PersonService } from "../../../services/person/person.service";
import { FormsModule } from '@angular/forms';
import { RoleTypeEnum } from "../../../models/enums/role-type.enum";
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";
import { MatSnackBar } from "@angular/material/snack-bar";

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

    constructor(private personService: PersonService,
         private router: Router,
        private snackBar: MatSnackBar) { }

    onSubmit(createPersonForm: any)
    {
        const { firstName, surname, role, group } = createPersonForm.value;
        
        console.log(firstName, surname, role, group);
        

        // Basic Validation Checks
        if (!firstName || !surname || !role) {
            this.snackBar.open('Please fill all the fields', 'Close', {
                duration: 3000,
              });
            return;
        }

        if ((role == RoleTypeEnum.DEVELOPER) && !group) {
            this.snackBar.open('Please select a group for the developer', 'Close', {
                duration: 3000,
              });
            return;
        }


    
        // Create the person
        this.personService.createPerson({ firstName, surname, role, group }).subscribe({
            next: (response) => {
                this.snackBar.open('Person created', 'Close', {
                    duration: 3000,
                  });
                this.router.navigate(['/people']);
            },
            error: (err) => {
                this.snackBar.open('Creation failed', 'Close', {
                    duration: 3000,
                  });
            }
        });
    }
}