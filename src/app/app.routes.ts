import { Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path: '', redirectTo: '/body', pathMatch: 'full'},
    {path: 'body', component: BodyComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];
