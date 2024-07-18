import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AppComponent } from '../../../app.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);
	fb = inject(FormBuilder);
	router = inject(Router);

	loginForm = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});
	visibilityIcon: string = 'assets/img/icons/visibility_off.png';
	inputType: string = 'password';

	constructor(public appComponent: AppComponent) {}

	/**
	 * Submits the login form and attempts to authenticate the user.
	 * @returns {void}
	 */
	onSubmit(): void {
		const rawForm = this.loginForm.getRawValue();
		this.appComponent.notificateUser('Anmelden');
		this.authService.login(rawForm.email, rawForm.password).subscribe({
			error: (err) => {
				console.log(err);
			},
		});
	}

	loginAsGuest() {
		this.appComponent.notificateUser('Anmelden');
		this.authService.loginAsGuest().subscribe({
			next: () => {
				this.setInitialDatabaseEntries('Gast');
			},
			error: (err) => {
				console.log(err);
			},
		});
	}

	/**
	 * Checks if a form control is invalid and has been touched or is dirty.
	 * @param {FormControl<string>} formControl - The form control to check.
	 * @returns {boolean} True if the form control is invalid and touched or dirty, otherwise false.
	 */
	formInvalid(formControl: FormControl<string>): boolean {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}

	changePasswordVisibility() {
		if (this.inputType === 'password') {
			this.inputType = 'text';
			this.visibilityIcon = 'assets/img/icons/visibility.png';
		} else {
			this.inputType = 'password';
			this.visibilityIcon = 'assets/img/icons/visibility_off.png';
		}
	}

	/**
	 * Logs in the user with Google authentication.
	 * @returns {void}
	 */
	loginWithGoogle(): void {
		this.appComponent.notificateUser('Anmelden');
		this.authService.signupWithGoogle().subscribe({
			next: () => {
				this.setInitialDatabaseEntries();
			},
		});
	}

	/**
	 * Sets initial database entries for the logged-in user.
	 * @returns {void}
	 */

	setInitialDatabaseEntries(username?: string): void {
		const userId = this.authService.firebaseAuth.currentUser!.uid;
		const userDoc = doc(this.firestore, 'users', userId);
		const privateChatDoc = doc(this.firestore, 'privateNotes', userId);
		setDoc(userDoc, this.setUserObject(username)).then(() => {
			setDoc(privateChatDoc, this.setPrivateNoteObject());
		});
	}

	/**
	 * Creates a user object for Firestore.
	 * @param {string} [username] - Optional username for the user.
	 * @returns {Object} The user object.
	 */
	setUserObject(username?: string): Object {
		const user = this.authService.firebaseAuth.currentUser!;
		return {
			userId: user.uid,
			name: username
				? username
				: user.displayName
				? user.displayName
				: 'Gast',
			status: true,
			photoURL: user.photoURL
				? user.photoURL
				: 'assets/img/character-images/character_1.png',
			channels: [],
			email: user.email ? user.email : 'gast@gast.com',
			privateNoteRef: user.uid,
		};
	}

	/**
	 * Creates a private note object for Firestore.
	 * @returns {Object} The private chat object.
	 */
	setPrivateNoteObject(): Object {
		const user = this.authService.firebaseAuth.currentUser!;
		return {
			privatChatId: user.uid,
			privateNoteCreator: user.uid,
		};
	}
}
