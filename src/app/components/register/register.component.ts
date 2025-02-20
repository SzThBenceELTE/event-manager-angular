import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupTypeEnum } from '../../models/enums/group-type.enum';
import { RoleTypeEnum } from '../../models/enums/role-type.enum';
import { AuthService } from '../../services/auth/auth.service';
import { switchMap } from 'rxjs/operators';

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

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

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

    // Chain the createUser and login calls
    this.userService.createUser(userData).pipe(
      switchMap(() => this.authService.login(userData.name, userData.password))
    ).subscribe({
      next: (response) => {
        console.log('Registration and login successful', response);
        // Navigate to the next page (for example, a dashboard)
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Registration or login failed', err);
      }
    });
  }
}
