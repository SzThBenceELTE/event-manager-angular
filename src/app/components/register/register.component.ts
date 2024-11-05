import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
})
export class RegisterComponent {

    constructor(private userService : UserService, private router: Router) { }

    onSubmit(registerForm: any) {
        const { username, email, password } = registerForm.value;

        this.userService.createUser({username, email, password}).subscribe({
            next: (response) => {
                console.log('Register successful', response);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Register failed', err);
            }
        });
    }

}