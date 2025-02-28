import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupTypeEnum } from '../../models/enums/group-type.enum';
import { RoleTypeEnum } from '../../models/enums/role-type.enum';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class RegisterComponent {

    groupTypes = Object.values(GroupTypeEnum);
    roleTypes = Object.values(RoleTypeEnum);

    constructor(private userService : UserService, private router: Router) { }

    onSubmit(registerForm: any) {
        const { username, email, password, firstName, surname, role, group } = registerForm.value;
    
        // Basic Validation Checks
        if (!username || !email || !password) {
            console.error('Please fill all the fields');
            return;
        }
    
        if (password.length < 6) {
            console.error('Password must be at least 6 characters');
            return;
        }
    
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            console.error('Invalid email');
            return;
        }
    
        const userData = { name: username, email, password, firstName, surname, role, group };

        this.userService.createUser(userData).subscribe({
            next: (response) => {
              console.log('Registration successful', response);
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error('Registration failed', err);
            }
          });

          

        // // Check if email already exists asynchronously
        // this.userService.getUserByEmail(email).subscribe({
        //     next: (existingUser) => {
        //         if (existingUser && existingUser.email) {   //check not just value, but also if the email part exists aswell
        //             console.error('Email already exists');
        //             return;
        //         }
                
        //         // Create the user if email is unique
        //         this.userService.createUser({ name: username, email, password }).subscribe({
        //             next: (response) => {
        //                 console.log('Register successful', response);
        //                 this.router.navigate(['/login']);
        //             },
        //             error: (err) => {
        //                 console.error('Register failed', err);
        //             }
        //         });
        //     },
        //     error: (err) => {
        //         console.error('Error checking email existence', err);
        //     }
        // });
    }
    

}