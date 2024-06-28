import { Routes } from '@angular/router';

// post-login components
import { HomeComponent } from './post-login/home/home.component';
import { NewMessageComponent } from './post-login/new-message/new-message.component';
import { ChannelComponent } from './post-login/channel/channel.component';

    // pre-login components
import { LandingPageComponent } from './pre-login/landing-page/landing-page.component';



export const routes: Routes = [

    // pre-login components
    {path: 'login', component: LandingPageComponent },

    // post-login components
    {path: 'home', component: HomeComponent,
        children: [
            {path:'channel', component: ChannelComponent},
            {path: 'new-message', component: NewMessageComponent},
        ]
    },

];
