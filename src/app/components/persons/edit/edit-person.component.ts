// edit-person.component.ts
import { Component, OnInit } from "@angular/core";
import { PersonModel } from "../../../models/person.model";
import { PersonService } from "../../../services/person/person.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RoleTypeEnum } from "../../../models/enums/role-type.enum";
import { GroupTypeEnum } from "../../../models/enums/group-type.enum";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'edit-person',
    templateUrl: './edit-person.component.html',
    //styleUrls: ['./edit-person.component.css'], // Ensure this line is uncommented
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class EditPersonComponent implements OnInit {
    roleTypes = Object.values(RoleTypeEnum);
    groupTypes = Object.values(GroupTypeEnum);

    id!: number;
    person: PersonModel = {
        id: 0,
        firstName: '',
        surname: '',
        role: RoleTypeEnum.MANAGER,
        group: undefined
    };
    formatLabel: (value: number) => string;

    constructor(
        private personService: PersonService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.formatLabel = (value: number) => {
            return value.toString();
        }
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.params['id']);
        // Fetch existing person data by ID
        this.personService.getPerson(this.id).subscribe({
            next: (data) => {
                console.log('Person data loaded successfully', data);
                this.person = data;
            },
            error: (err) => {
                console.error('Failed to load person data', err);
                this.router.navigate(['/people']); // Redirect if person not found
            }
        });
    }

    onSubmit(editPersonForm: any): void {
        const { firstName, surname, role, group } = editPersonForm.value;

        console.log(firstName, surname, role, group);

        // Basic Validation Checks
        if (!firstName || !surname || !role) {
            this.openErrorSnackbar('Please fill out all required fields.');
            return;
        }

        if (role === RoleTypeEnum.DEVELOPER && !group) {
            this.openErrorSnackbar('Please select a group for the developer.');
            return;
        }

        // Create the updated person object
        const updatedPerson: PersonModel = {
            id: this.id,
            firstName,
            surname,
            role,
            group: role === RoleTypeEnum.DEVELOPER ? group : ''
        };

        // Update the person
        this.personService.updatePerson(this.id,{
            firstName,
            surname,
            role,
            group: role === RoleTypeEnum.DEVELOPER ? group : ''
        } ).subscribe({
            next: (response) => {
                console.log('Person updated successfully', response);
                this.openSuccessSnackbar('Person updated successfully.');
                this.router.navigate(['/people']);
            },
            error: (err) => {
                console.error('Person update failed', err);
                this.openErrorSnackbar('Failed to update person.');
            }
        });
    }

    /**
     * Opens an error snack-bar with customized styling and positioning.
     * @param message The error message to display.
     */
    private openErrorSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000, // Increased duration for better visibility
            panelClass: ['custom-snackbar', 'error-snackbar'],
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
        });
    }

    /**
     * Opens a success snack-bar with customized styling and positioning.
     * @param message The success message to display.
     */
    private openSuccessSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['custom-snackbar', 'success-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }
}