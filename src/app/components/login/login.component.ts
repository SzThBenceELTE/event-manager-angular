// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(loginForm: any) {
    const { username, password } = loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/users']); // Navigate to the user list or dashboard on successful login
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }
}
