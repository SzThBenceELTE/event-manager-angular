// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PersonListComponent } from './components/persons/person-list/person-list.component';
//import { EventListComponent } from './components/event-list/event-list.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/auth/token.interceptor';

const appRoutes: Routes = [
  //{path : 'events', component: EventListComponent},
  { path : 'people', component: PersonListComponent },
  { path : 'register', component: RegisterComponent },
  { path: 'users', component: UserListComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login on root
  { path: '**', redirectTo: '/' } // Wildcard route
];

@NgModule({
    declarations: [
     
   
      // other components
    ],
    imports: [
      BrowserModule,
      FormsModule, // Add FormsModule here
      AppComponent,
      LoginComponent,
      RegisterComponent,
      PersonListComponent,
      UserListComponent,
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    bootstrap: []
  })
export class AppModule { }
