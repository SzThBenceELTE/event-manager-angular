import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn: boolean = false;
  userName: string | null = '';
  
  ngOnInit() {
    console.log('AppComponent ngOnInit');
    
    
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.getUsername().subscribe(username => {
      console.log('AppComponent ngOnInit getUsername', username);
      this.userName = username;
    });
    

    console.log('isLoggedIn', this.isLoggedIn);
    console.log('userName', this.userName);
    
  }

  // login(username: string, password: string) {
  //   this.authService.login(username, password);
  //   this.isLoggedIn = true;
  // }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  displayLoginName() {
    return this.authService.getName();
  }


}
