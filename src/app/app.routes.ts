import { Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';

export const routes: Routes = [
    {path: '', redirectTo: '/body', pathMatch: 'full'},
    {path: 'body', component: BodyComponent}
];
