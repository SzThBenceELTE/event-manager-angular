import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { Observable } from 'rxjs';
import { PersonModel } from './models/person.model';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('menuAnimation', [
      state(
        'closed',
        style({
          height: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'open',
        style({
          height: '*',
        })
      ),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class AppComponent {
  isNavbarCollapsed = true;
  //isLoggedIn: boolean = false;
  currentPerson$: Observable<PersonModel | null>;
  menuState = 'closed';

  constructor(public authService: AuthService) {
    this.currentPerson$ = this.authService.currentPerson$;
  }


  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    this.menuState = this.isNavbarCollapsed ? 'closed' : 'open';
  }

  logout() {
    this.authService.logout();
  }
}





// export class AppComponent implements OnInit {
//   isLoggedIn: boolean = false;
//   userName: string | null = '';
//   loginToken$!: Observable<string | null>; // Use Observable here instead of BehaviorSubject
//   currentPerson$: Observable<PersonModel | null>;

//   constructor(private authService: AuthService, private cookieService: CookieService) {
//     this.currentPerson$ = this.authService.currentPerson$;
//   }

//   ngOnInit() {
//     console.log('AppComponent ngOnInit');

//     // Initialize loginToken$ after authService is available
//     this.loginToken$ = this.authService.getLoginToken();

//     // Check the login status and get the username on component initialization
//     this.isLoggedIn = this.authService.isLoggedIn();

//     // Subscribe to the login token observable to update user status on login/logout
//     this.loginToken$.subscribe(token => {
//       if (token) {
//         // Fetch username if logged in
//         this.userName = this.authService.getName();
//       } else {
//         this.userName = null;
//       }
//       console.log('AppComponent ngOnInit loginToken', token);
//       console.log('AppComponent ngOnInit userName', this.userName);
      
//       // After the userName is set, store it in the cookie
//       if (this.userName) {
//         this.cookieService.set('userName', this.userName);  // Save username in cookies as fallback
//       } else {
//         this.cookieService.delete('userName');  // Remove username from cookies if logged out
//       }

//       this.currentPerson$.subscribe(person => {
//         this.isLoggedIn = !!person;
//       });
//     });
//   }

//   logout() {
//     this.authService.logout();
//     this.isLoggedIn = false;
//     this.userName = null; // Clear username on logout
//   }

//   displayLoginName() {
//     return this.userName || 'Guest';
//   }
// }
