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
	UserCredential,
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
				this.setUsername(response, username);
				sendEmailVerification(response.user);
			})
			.catch((error) => {
				console.log(error);
			});
		return from(promise);
	}

	setUsername(response: UserCredential, username: string) {
		const promise = updateProfile(response.user, { displayName: username });
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
		this.route.queryParams.subscribe((params) => {
			if (this.router.url.includes('resetPassword')) {
				this.router.navigate(['/reset-password'], {
					queryParams: params,
				});
			}
			if (this.router.url.includes('verifyEmail')) {
				this.verifyEmail(params['oobCode']).subscribe((test) => {});
			} else {
				this.user$.subscribe((user) => {
					if (user) {
						if (!user.photoURL) {
							this.router.navigateByUrl('/avatar');
						}
					} else {
						this.router.navigateByUrl('/');
					}
				});
			}
		});
	}

	verifyEmail(actionCode: string) {
		const promise = applyActionCode(this.firebaseAuth, actionCode);
		return from(promise);
	}

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
}
