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
				const auth = this.firebaseAuth;
				const user = {
					userId: auth.currentUser!.uid,
					name: auth.currentUser!.displayName,
					status: true,
					photoURL: auth.currentUser!.photoURL,
					channels: [],
					email: auth.currentUser!.email,
					privateNoteRef: auth.currentUser!.uid,
				};
				const privateChat = {
					privatChatId: auth.currentUser!.uid,
					chatCreator: auth.currentUser!.uid,
					chatReciver: '',
					privateNoteCreator: auth.currentUser!.uid,
					messages: [],
					createdAt: new Date().getTime(),
					createdBy: auth.currentUser!.uid,
				};
				setDoc(
					doc(this.firestore, 'users', auth.currentUser!.uid),
					user
				);
				setDoc(
					doc(this.firestore, 'privateChats', auth.currentUser!.uid),
					privateChat
				);
				this.router.navigateByUrl('/home');
			},
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}
}
