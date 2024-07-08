import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export const forbiddenAvatarValidator = (
	control: AbstractControl
): ValidationErrors | null => {
	const avatars = ['assets/img/profile.png'];
	return avatars.includes(control.value)
		? { forbiddenAvatar: 'Bitte wählen Sie einen Avatar aus.' }
		: null;
};

@Component({
	selector: 'app-select-avatar',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, RouterLink, FormsModule],
	templateUrl: './select-avatar.component.html',
	styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
	fb = inject(FormBuilder);
	firebaseAuth = inject(Auth);
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);
	router = inject(Router);
	avatarForm = this.fb.nonNullable.group({
		avatar: [
			'assets/img/profile.png',
			[Validators.required, forbiddenAvatarValidator],
		],
	});
	avatarSig = signal(this.avatarForm.get('avatar')!.value);

	errorMessage: string | null = null;

	constructor() {
		this.authService.checkUserStatus();
		this.avatarForm.get('avatar')!.valueChanges.subscribe((avatar) => {
			this.avatarSig.set(avatar);
		});
	}

	onSubmit(): void {
		const rawForm = this.avatarForm.getRawValue();
		this.authService.setAvatar(rawForm.avatar).subscribe({
			next: () => {
				this.setUserDatabaseEntries();
				this.router.navigateByUrl('/');
			},
			error: (err) => {
				this.errorMessage = err.code;
			},
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
