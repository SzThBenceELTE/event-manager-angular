import { Routes } from '@angular/router';

import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {PersonListComponent} from './components/persons/person-list/person-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreatePersonComponent } from './components/persons/create/create-person.component';
import { EditPersonComponent } from './components/persons/edit/edit-person.component';

export const routes: Routes = [
    // { path: '', component: HomePageComponent },
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
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];
