import { Component, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	router = inject(Router);
	firestore: Firestore = inject(Firestore);
	firebaseAuth = inject(Auth);

	registerForm = this.fb.nonNullable.group({
		username: ['', [Validators.required, Validators.minLength(5)]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
		privacy: [false, Validators.requiredTrue],
	});

	errorMessage: string | null = null;

	constructor() {}

	onSubmit(): void {
		const rawForm = this.registerForm.getRawValue();
		this.authService
			.register(rawForm.email, rawForm.username, rawForm.password)
			.subscribe({
				next: () => {
					this.setUserDatabaseEntries();
					this.authService.checkUserStatus();
				},
				error: (err) => {
					this.errorMessage = err.code;
				},
			});
	}

	formInvalid(formControl: FormControl<string> | FormControl<boolean>) {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}

	setUserDatabaseEntries() {
		setDoc(
			doc(this.firestore, 'users', this.firebaseAuth.currentUser!.uid),
			this.setUserObject()
		);
		setDoc(
			doc(
				this.firestore,
				'privateChats',
				this.firebaseAuth.currentUser!.uid
			),
			this.setprivateChatObject()
		);
	}

	setUserObject() {
		return {
			userId: this.firebaseAuth.currentUser!.uid,
			name: this.firebaseAuth.currentUser!.displayName,
			status: true,
			photoURL: this.firebaseAuth.currentUser!.photoURL,
			channels: [],
			email: this.firebaseAuth.currentUser!.email,
			privateNoteRef: this.firebaseAuth.currentUser!.uid,
		};
	}

	setprivateChatObject() {
		return {
			privatChatId: this.firebaseAuth.currentUser!.uid,
			chatCreator: this.firebaseAuth.currentUser!.uid,
			chatReciver: '',
			privateNoteCreator: this.firebaseAuth.currentUser!.uid,
			messages: [],
			createdAt: new Date().getTime(),
			createdBy: this.firebaseAuth.currentUser!.uid,
		};
	}
}
