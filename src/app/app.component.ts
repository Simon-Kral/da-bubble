import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from './post-login/home/home.component';
import { SidenavComponent } from './post-login/home/side-navigation/sidenav/sidenav.component';
import { ChannelListComponent } from './post-login/home/side-navigation/sidenav/channel-list/channel-list.component';
import { PrivateMessageListComponent } from './post-login/home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { NewMessageComponent } from './post-login/new-message/new-message.component';
import { CreateNewChannelComponent } from './post-login/home/channel/create-channel/create-new-channel/create-new-channel.component';
import { ChatHistoryComponent } from './post-login/shared/chat-history/chat-history.component';
import { AuthService } from './services/authentication/auth.service';
import { applyActionCode, User } from '@angular/fire/auth';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		HomeComponent,
		SidenavComponent,
		NewMessageComponent,
		ChannelListComponent,
		PrivateMessageListComponent,
		CreateNewChannelComponent,
		ChatHistoryComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	title = 'da-bubble';
	authService = inject(AuthService);
	router = inject(Router);

	/**
	 * Constructor to initialize the component with the activated route.
	 * @param {ActivatedRoute} route - The activated route to access query parameters.
	 */
	constructor(private route: ActivatedRoute) {}

	/**
	 * Initializes the component, subscribes to user authentication status, and handles query parameters.
	 * @returns {void}
	 */
	ngOnInit(): void {
		console.log('subbed to user');
		this.authService.user$.subscribe((user) => {
			if (user) {
				console.log('user:', user);
				this.setUserData(user);
				this.handleNavigation(user);
			} else {
				this.handleNoUser();
			}
		});

		this.route.queryParams.subscribe((params) => {
			this.handleResetPasswordAction(params);
			this.handleVerifyEmailAction(params);
		});
	}

	/**
	 * Sets the user data in the session storage.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	setUserData(user: User): void {
		// this.setSignal(user);
		this.setSessionStorage(user);
	}

	/**
	 * Handles navigation based on user properties.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	handleNavigation(user: User): void {
		if (!user.photoURL) {
			this.navToAvatar();
		} else if (!user.emailVerified) {
			this.handleEmailVerification();
		} else {
			this.navToHome();
		}
	}

	/**
	 * Sets the user data in a signal.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	setSignal(user: User): void {
		this.authService.currentUserSig.set({
			id: user.uid,
			email: user.email!,
			username: user.displayName,
			avatar: user.photoURL,
		});
		console.log('signal:', this.authService.currentUserSig());
	}

	/**
	 * Sets the user data in session storage.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	setSessionStorage(user: User): void {
		console.log('sessionStorage was set');
		if (!(sessionStorage.getItem('currentUserId') === user.uid)) {
			sessionStorage.setItem('currentUserId', user.uid);
		}
	}

	/**
	 * Navigates to the avatar selection page.
	 * @returns {void}
	 */
	navToAvatar(): void {
		console.log('please set avatar');
		this.router.navigateByUrl('/avatar');
	}

	/**
	 * Handles email verification.
	 * @returns {void}
	 */
	handleEmailVerification(): void {
		console.log('verify your email');
	}

	/**
	 * Navigates to the home page if the user is authenticated and the current URL is the root.
	 * @returns {void}
	 */
	navToHome(): void {
		if (this.router.url === '/') {
			console.log('logged in');
			this.router.navigateByUrl('/home');
		}
	}

	/**
	 * Handles the case when there is no authenticated user.
	 * @returns {void}
	 */
	handleNoUser(): void {
		console.log('no user');
		this.authService.currentUserSig.set(null);
		this.router.navigateByUrl('/');
	}

	/**
	 * Handles the reset password action based on the query parameters.
	 * @param {Params} params - The query parameters.
	 * @returns {void}
	 */
	handleResetPasswordAction(params: Params): void {
		if (this.router.url.includes('resetPassword')) {
			this.router.navigate(['/reset-password'], {
				queryParams: params,
			});
		}
	}

	/**
	 * Handles the verify email action based on the query parameters.
	 * @param {Params} params - The query parameters.
	 * @returns {void}
	 */
	handleVerifyEmailAction(params: Params): void {
		if (this.router.url.includes('verifyEmail')) {
			applyActionCode(
				this.authService.firebaseAuth,
				params['oobCode']
			).then(() => {
				console.log('verified email');
				this.router.navigateByUrl('/home');
			});
		}
	}
}
