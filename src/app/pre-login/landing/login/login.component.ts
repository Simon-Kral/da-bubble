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
import {
	Auth,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	router = inject(Router);
	firebaseAuth = inject(Auth);
	firestore: Firestore = inject(Firestore);

	loginForm = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});

	errorMessage: string | null = null;

	onSubmit(): void {
		const rawForm = this.loginForm.getRawValue();
		this.authService.login(rawForm.email, rawForm.password).subscribe({
			next: () => {
				this.pushUserIdToSessionStorage();
				this.authService.checkUserStatus();
			},
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}

	formInvalid(formControl: FormControl<string>) {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}

	pushUserIdToSessionStorage() {
		const id = this.authService.firebaseAuth.currentUser!.uid;
		sessionStorage.setItem(`currentUserId`, id);
	}

	loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		signInWithPopup(this.authService.firebaseAuth, provider)
			.then((result) => {
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential!.accessToken;
				const user = result.user;
				this.pushUserIdToSessionStorage();
				this.authService.checkUserStatus();
				this.setUserDatabaseEntries();
				console.log(credential);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.customData.email;
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				console.log(errorCode, errorMessage, email, credential);
			});
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
