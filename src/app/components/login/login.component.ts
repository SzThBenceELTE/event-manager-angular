// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginError: string = "";

  onSubmit(loginForm: any) {
    const { username, password } = loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loginError = "";
        console.log('Login successful', response);
        this.authService.setCurrentPerson(username); // Set the current user
        this.router.navigate(['/users']); // Navigate to the user list or dashboard on successful login
      },
      error: (err) => {
        this.loginError = "Bad login attempt";
        console.error('Login failed', err);
      }
    });
  }
}
