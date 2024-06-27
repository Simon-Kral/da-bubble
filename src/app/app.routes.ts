import { Routes } from '@angular/router';
import { HomeComponent } from './post-login/home/home.component';
import { LandingPageComponent } from './pre-login/landing-page/landing-page.component';

export const routes: Routes = [
    {path: 'login', component: LandingPageComponent },
    {path: 'home', component: HomeComponent},
];
