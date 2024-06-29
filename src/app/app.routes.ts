import { Routes } from '@angular/router';
import { HomeComponent } from './post-login/home/home.component';
import { LandingComponent } from './pre-login/landing/landing.component';
import { authGuard } from './services/authentication/auth.guard'
import { SignUpComponent } from './pre-login/landing/sign-up/sign-up.component';

export const routes: Routes = [
    {path: 'login', component: LandingComponent },
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
];
