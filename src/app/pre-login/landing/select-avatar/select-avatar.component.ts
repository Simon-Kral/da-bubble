import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, map, of } from 'rxjs';

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
	imports: [
		ReactiveFormsModule,
		NgIf,
		RouterLink,
		FormsModule,
		NgFor,
		CommonModule,
	],
	templateUrl: './select-avatar.component.html',
	styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent implements OnInit {
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);
	fb = inject(FormBuilder);
	router = inject(Router);
	avatarForm = this.fb.nonNullable.group({
		avatar: [
			'assets/img/profile.png',
			[Validators.required, forbiddenAvatarValidator],
		],
	});
	avatarSig = signal(this.avatarForm.get('avatar')!.value);

	/**
	 * Initializes the component and subscribes to avatar form value changes.
	 */
	ngOnInit(): void {
		this.avatarForm.get('avatar')!.valueChanges.subscribe((avatar) => {
			this.avatarSig.set(avatar);
		});
	}

	/**
	 * Submits the avatar selection form and updates the user's avatar in the database.
	 * @returns {void}
	 */
	onSubmit(): void {
		const rawForm = this.avatarForm.getRawValue();
		this.authService.setAvatar(rawForm.avatar).subscribe({
			next: () => {
				const userId = this.authService.firebaseAuth.currentUser!.uid;
				const userDoc = doc(this.firestore, 'users', userId);
				updateDoc(userDoc, { photoURL: rawForm.avatar });
				console.log('avatar was set');
				console.log('verify your email');
				this.router.navigateByUrl('/');
			},
			error: (err) => {
				console.log(err);
			},
		});
	}
}
