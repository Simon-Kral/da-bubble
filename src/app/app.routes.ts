import { Routes } from '@angular/router';

// post-login components
import { HomeComponent } from './post-login/home/home.component';
import { NewMessageComponent } from './post-login/new-message/new-message.component';
import { ChannelComponent } from './post-login/channel/channel.component';

    // pre-login components
import { LandingComponent } from './pre-login/landing/landing.component';
import { RegisterComponent } from './pre-login/landing/register/register.component';
import { ResetPasswordComponent } from './pre-login/landing/reset-password/reset-password.component';
import { ChooseAvatarComponent } from './pre-login/landing/choose-avatar/choose-avatar.component';
import { LoginComponent } from './pre-login/landing/login/login.component';



export const routes: Routes = [

    // pre-login components
    {path: '', component: LandingComponent,
        children: [
            {path: '', component: LoginComponent },
            {path: 'register', component: RegisterComponent },
            {path: 'avatar', component: ChooseAvatarComponent },
            {path: 'reset-password', component: ResetPasswordComponent },
        ]
    },

    // post-login components
    {path: 'home', component: HomeComponent,
        children: [
            {path:'channel', component: ChannelComponent},
            {path: 'new-message', component: NewMessageComponent},
        ]
    },
];
