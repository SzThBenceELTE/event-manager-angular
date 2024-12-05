
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {PersonListComponent} from './components/persons/person-list/person-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreatePersonComponent } from './components/persons/create/create-person.component';
import { EditPersonComponent } from './components/persons/edit/edit-person.component';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { CreateEventComponent } from './components/events/create/create-event.component';
import { EditEventComponent } from './components/events/edit/edit-event.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from './components/unathorized/unauthorized.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    // 
    
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {   
        path: 'unauthorized', 
        component: UnauthorizedComponent },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'people',
        component: PersonListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'people/create',
        component: CreatePersonComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'people/edit/:id',
        component: EditPersonComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'events',
        component: EventListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'events/create',
        component: CreateEventComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'events/edit/:id',
        component: EditEventComponent,
        canActivate: [AuthGuard],
    },
    // { path: '', component: HomePageComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }