import { Component, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
})
export class SignupComponent {
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);
	fb = inject(FormBuilder);
	router = inject(Router);

	registerForm = this.fb.nonNullable.group({
		username: ['', [Validators.required, Validators.minLength(5)]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
		privacy: [false, Validators.requiredTrue],
	});

	/**
	 * Submits the registration form and attempts to register a new user.
	 * @returns {void}
	 */
	onSubmit(): void {
		const rawForm = this.registerForm.getRawValue();
		this.authService
			.signup(rawForm.email, rawForm.username, rawForm.password)
			.subscribe({
				next: () => {
					this.setInitialDatabaseEntries(rawForm.username);
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
	formInvalid(
		formControl: FormControl<string> | FormControl<boolean>
	): boolean {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}

	/**
	 * Sets initial database entries for the newly registered user.
	 * @param {string} username - The username of the newly registered user.
	 * @returns {void}
	 */
	setInitialDatabaseEntries(username: string): void {
		const userId = this.authService.firebaseAuth.currentUser!.uid;
		const userDoc = doc(this.firestore, 'users', userId);
		const privateChatDoc = doc(this.firestore, 'privateChats', userId);
		setDoc(userDoc, this.setUserObject(username)).then(() => {
			setDoc(privateChatDoc, this.setprivateChatObject());
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
			name: username ? username : user.displayName,
			status: true,
			photoURL: user.photoURL,
			channels: [],
			email: user.email,
			privateNoteRef: user.uid,
		};
	}

	/**
	 * Creates a private chat object for Firestore.
	 * @returns {Object} The private chat object.
	 */
	setprivateChatObject(): Object {
		const user = this.authService.firebaseAuth.currentUser!;
		return {
			privatChatId: user.uid,
			chatCreator: user.uid,
			chatReciver: '',
			privateNoteCreator: user.uid,
			messages: [],
			createdAt: new Date().getTime(),
			createdBy: user.uid,
		};
	}
}
