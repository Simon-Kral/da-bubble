import { Injectable, inject, signal } from '@angular/core';
import {
	Auth,
	User,
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	user,
	verifyPasswordResetCode,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	firebaseAuth = inject(Auth);
	user$ = user(this.firebaseAuth);
	currentUserSig = signal<UserInterface | null | undefined>(undefined);
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
				console.log('Konto erfolgreich erstellt');
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
		).then(() => {
			console.log('Anmelden');
		});
		return from(promise);
	}

	setAvatar(avatar: string): Observable<void> {
		const auth = this.firebaseAuth;
		const promise = updateProfile(auth.currentUser!, { photoURL: avatar });
		this.addAvatarToSignal(auth.currentUser!, avatar);
		return from(promise);
	}

	logout(): Observable<void> {
		const promise = signOut(this.firebaseAuth);
		return from(promise);
	}

	checkUserStatus() {
		if (this.signalIsUp()) {
		} else {
			this.user$.subscribe((user) => {
				if (user) {
					this.setInitialUserSignal(user);
					if (user.photoURL)
						this.addAvatarToSignal(user, user.photoURL);
					else this.router.navigateByUrl('/avatar');
				} else {
					this.handleUserUnset();
				}
			});
		}
	}

	setInitialUserSignal(user: User) {
		this.currentUserSig.set({
			userId: user.uid!,
			email: user.email!,
			username: user.displayName!,
		});
	}

	addAvatarToSignal(user: User, avatar: string) {
		this.currentUserSig.update(
			(prevUser: UserInterface | null | undefined) => {
				prevUser!.avatar = avatar;
				return prevUser;
			}
		);
		if (this.signalIsUp()) {
			this.router.navigateByUrl('/home');
		} else {
			this.checkUserStatus();
		}
	}

	handleUserUnset() {
		this.currentUserSig.set(null);
		if (!this.router.url.includes('/reset-password')) {
			this.router.navigateByUrl('/');
		}
	}

	signalIsUp() {
		return (
			this.currentUserSig() &&
			this.currentUserSig()!.avatar &&
			this.currentUserSig()!.email &&
			this.currentUserSig()!.userId &&
			this.currentUserSig()!.username
		);
	}

	sendResetLink(email: string) {
		sendPasswordResetEmail(this.firebaseAuth, email)
			.then(() => {
				console.log('E-Mail gesendet');
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
						console.log('Passwort geändert');
						this.router.navigateByUrl('/');
					})
					.catch((error) => {
						console.log(error);
					});
			});
		});
	}
}
