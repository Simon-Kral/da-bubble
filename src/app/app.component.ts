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
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

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
	firestore = inject(Firestore);
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
		setTimeout(() => {
			console.log('subbed to params');
			this.route.queryParams.subscribe({
				next: (params) => {
					this.authService.user$.subscribe((user) => {
						if (this.router.url.includes('?mode=')) {
							this.handleQueryParams(params);
						} else if (user) {
							console.log('subbed to user');
							console.log('user:', user);
							this.setUserData(user).then(() => {
								this.handleNavigation(user);
							});
						} else {
							this.handleNoUser();
						}
					});
				},
			});
		}, 1);
	}

	/**
	 * Handles various query parameters related to user actions.
	 * @param {Params} params - The URL parameters containing action codes and other relevant information.
	 * @returns {void}
	 */
	handleQueryParams(params: Params): void {
		this.handleResetPasswordAction(params);
		this.handleVerifyEmailAction(params);
		this.handleVerifyNewEmailAction(params);
		this.handleRecoverEmailAction(params);
	}

	/**
	 * Sets the user data in the session storage.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	setUserData(user: User): Promise<void> {
		this.setSignal(user);
		this.setSessionStorage(user);
		return updateDoc(
			doc(
				this.firestore,
				`users/${this.authService.firebaseAuth.currentUser!.uid}`
			),
			{ status: true }
		);
	}

	/**
	 * Handles navigation based on user properties.
	 * @param {User} user - The authenticated user.
	 * @returns {void}
	 */
	handleNavigation(user: User): void {
		if (
			!user.photoURL ||
			user.photoURL.includes('googleusercontent') ||
			user.photoURL.includes('assets/img/profile.png')
		) {
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
		// this.authService.currentUserSig.set(null);
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
				this.router.navigateByUrl('/').then(() => {
					setTimeout(() => {
						this.router.navigateByUrl('/home');
					}, 1000);
				});
			});
		}
	}

	/**
	 * Handles the verify new email action on email change based on the query parameters.
	 * @param {Params} params - The query parameters.
	 * @returns {void}
	 */
	handleVerifyNewEmailAction(params: Params): void {
		if (this.router.url.includes('verifyAndChangeEmail')) {
			applyActionCode(
				this.authService.firebaseAuth,
				params['oobCode']
			).then(() => {
				console.log('verified new email');
				this.router.navigateByUrl('/');
			});
		}
	}

	/**
	 * Handles the recovery of an email adress based on the query parameters.
	 * @param {Params} params - The query parameters.
	 * @returns {void}
	 */
	handleRecoverEmailAction(params: Params): void {
		if (this.router.url.includes('recoverEmail')) {
			applyActionCode(
				this.authService.firebaseAuth,
				params['oobCode']
			).then(() => {
				console.log('recovered email');
				this.router.navigateByUrl('/');
			});
		}
	}
}
