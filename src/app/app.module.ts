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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { AuthService } from './services/auth/auth.service'; // Ensure you have AuthService
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedComponent } from './components/unathorized/unauthorized.component';
import { AuthGuard } from './services/auth/auth.guard';


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
     UnauthorizedComponent,
   
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
      MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule,
      NgxMaterialTimepickerModule,
      MatSnackBarModule,
      HttpClientModule,
      BrowserAnimationsModule,
    ],
    providers: [ CookieService,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
      MatDatepickerModule,
      MatNativeDateModule,
      AuthGuard,
      
    ],
    bootstrap: []
  })
export class AppModule { }
