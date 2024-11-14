
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

export const routes: Routes = [
    // 
    {
        path: 'users',
        component: UserListComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'people',
        component: PersonListComponent
    },
    {
        path: 'people/create',
        component: CreatePersonComponent
    },
    {
        path: 'people/edit/:id',
        component: EditPersonComponent
    },
    {
        path: 'events',
        component: EventListComponent
    },
    {
        path: 'events/create',
        component: CreateEventComponent
    },
    {
        path: 'events/edit/:id',
        component: EditEventComponent
    },
    // { path: '', component: HomePageComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }