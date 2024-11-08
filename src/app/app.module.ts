// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PersonListComponent } from './components/persons/person-list.component';

const appRoutes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login on root
  { path: '**', redirectTo: '/login' } // Wildcard route
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
    ],
    providers: [],
    bootstrap: []
  })
export class AppModule { }
