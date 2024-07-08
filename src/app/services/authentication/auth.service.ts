import { Injectable, inject } from '@angular/core';
import {
	Auth,
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail,
	updateProfile,
	verifyPasswordResetCode,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	firebaseAuth = inject(Auth);
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
		const auth = this.firebaseAuth;
		const promise = updateProfile(auth.currentUser!, { photoURL: avatar });
		return from(promise);
	}

	logout(): Observable<void> {
		const promise = signOut(this.firebaseAuth);
		return from(promise);
	}

	checkUserStatus() {
		if (this.firebaseAuth.currentUser) {
			if (this.firebaseAuth.currentUser.photoURL) {
				this.router.navigateByUrl('/home');
			} else {
				this.router.navigateByUrl('/');
			}
		} else if (!this.router.url.includes('/reset-password')) {
			this.router.navigateByUrl('/');
		}
	}

	sendResetLink(email: string) {
		sendPasswordResetEmail(this.firebaseAuth, email)
			.then(() => {
				this.router.navigateByUrl('/');
			})
			.catch((error) => {
				console.log(error);
			});
	}

	resetPassword(password: string) {
		this.route.queryParams.subscribe((params) => {
			const actionCode = params['oobCode'];
			verifyPasswordResetCode(this.firebaseAuth, actionCode).then(() => {
				confirmPasswordReset(this.firebaseAuth, actionCode, password)
					.then(() => {
						this.router.navigateByUrl('/');
					})
					.catch((error) => {
						console.log(error);
					});
			});
		});
	}

	changeEmail(newEmail: string) {
		const promise = updateEmail(this.firebaseAuth.currentUser!, newEmail)
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
		return from(promise);
	}
}
