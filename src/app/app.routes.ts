import { Routes } from '@angular/router';

// post-login components
import { HomeComponent } from './post-login/home/home.component';
import { NewMessageComponent } from './post-login/new-message/new-message.component';
import { ChannelComponent } from './post-login/channel/channel.component';
import { PrivateMessageComponent } from './post-login/private-message/private-message.component';

// pre-login components
import { LandingComponent } from './pre-login/landing/landing.component';
import { RegisterComponent } from './pre-login/landing/register/register.component';
import { PasswordResetRequestComponent } from './pre-login/landing/password-reset-request/password-reset-request.component';
import { SelectAvatarComponent } from './pre-login/landing/select-avatar/select-avatar.component';
import { LoginComponent } from './pre-login/landing/login/login.component';
import { ResetPasswordComponent } from './pre-login/landing/reset-password/reset-password.component';

export const routes: Routes = [
	// pre-login components
	{
		path: '',
		component: LandingComponent,
		children: [
			{ path: '', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'avatar', component: SelectAvatarComponent },
			{
				path: 'password-reset-request',
				component: PasswordResetRequestComponent,
			},
			{ path: 'reset-password', component: ResetPasswordComponent },
		],
	},

	// post-login components
	{
		path: 'home',
		component: HomeComponent,
		children: [
			{ path: 'channel/:id', component: ChannelComponent },
			{ path: 'private-message/:id', component: PrivateMessageComponent },
			{ path: 'new-message', component: NewMessageComponent },
		],
	},
];
