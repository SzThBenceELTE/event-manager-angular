import { Routes } from '@angular/router';

import { UserListComponent } from './components/user-list/user-list.component';
import { LoginComponent } from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';

export const routes: Routes = [
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
    }
];
