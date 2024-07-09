import { Injectable, inject, signal } from '@angular/core';
import {
	applyActionCode,
	Auth,
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updateProfile,
	user,
	verifyPasswordResetCode,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	firebaseAuth = inject(Auth);
	user$ = user(this.firebaseAuth);
	router = inject(Router);

	constructor(private route: ActivatedRoute) {}

	register(
		email: string,
		username: string,
		password: string
	): Observable<void> {
		const promise = createUserWithEmailAndPassword(
			this.firebaseAuth,
			email,
			password
		)
			.then((response) => {
				updateProfile(response.user, { displayName: username });
				sendEmailVerification(response.user);
			})
			.catch((error) => {
				console.log(error);
			});
		return from(promise);
	}

	login(email: string, password: string): Observable<void> {
		const promise = signInWithEmailAndPassword(
			this.firebaseAuth,
			email,
			password
		)
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
		return from(promise);
	}

	setAvatar(avatar: string): Observable<void> {
		const promise = updateProfile(this.firebaseAuth.currentUser!, {
			photoURL: avatar,
		});
		return from(promise);
	}

	logout(): Observable<void> {
		const promise = signOut(this.firebaseAuth);
		return from(promise);
	}

	checkUserStatus() {
		console.log(this.router.url);
		console.log(this.router.url.includes('resetPassword'));
		this.route.queryParams.subscribe((params) => {
			if (this.router.url.includes('resetPassword')) {
				this.router.navigate(['/reset-password'], {
					queryParams: params,
				});
			}
			if (this.router.url.includes('verifyEmail')) {
				applyActionCode(this.firebaseAuth, params['oobCode']);
			}
		});

		// console.log(this.router.url);
		// if (this.router.url.includes('resetPassword')) {
		// 	this.route.queryParams.subscribe((params) => {
		// 		console.log(params);
		// 	});
		// 	// this.router.navigateByUrl('/reset-password');
		// }
		// if (this.router.url.includes('verifyEmail')) {
		// 	// this.router.navigateByUrl('/');
		// } else {
		// 	this.user$.subscribe((user) => {
		// 		if (user) {
		// 			if (user.photoURL) {
		// 				this.router.navigateByUrl('/home');
		// 			} else {
		// 				this.router.navigateByUrl('/avatar');
		// 			}
		// 		} else {
		// 			this.router.navigateByUrl('/');
		// 		}
		// 	});
		// }
	}

	// this.route.queryParams.subscribe((params) => {
	// 	const actionCode = params['oobCode'];
	// 	this.authService
	// 		.resetPassword(actionCode, rawForm.password)
	// 		.subscribe({
	// 			next: () => {
	// 				console.log('password changed')
	// 				this.router.navigateByUrl('/');
	// 			},
	// 			error: (err) => {
	// 				this.errorMessage = err.code;
	// 			},
	// 		});
	// });

	sendPasswordResetLink(email: string): Observable<void> {
		const promise = sendPasswordResetEmail(this.firebaseAuth, email)
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
		return from(promise);
	}

	resetPassword(actionCode: string, password: string): Observable<void> {
		const promise = verifyPasswordResetCode(
			this.firebaseAuth,
			actionCode
		).then(() => {
			confirmPasswordReset(this.firebaseAuth, actionCode, password)
				.then(() => {})
				.catch((error) => {
					console.log(error);
				});
		});
		return from(promise);
	}

	// sendEmailResetLink(newEmail: string): Observable<void> {
	// 	const promise = sendEmailVerification(this.firebaseAuth.currentUser!)
	// 		.then(() => {})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// 	return from(promise);
	// }

	// resetEmail(newEmail: string): Observable<void> {
	// 	const promise = updateEmail(this.firebaseAuth.currentUser!, newEmail)
	// 		.then(() => {})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// 	return from(promise);
	// }

	// changeEmail(newEmail: string) {
	// 	const promise = updateEmail(this.firebaseAuth.currentUser!, newEmail)
	// 		.then(() => {})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// 	return from(promise);
	// }
}
