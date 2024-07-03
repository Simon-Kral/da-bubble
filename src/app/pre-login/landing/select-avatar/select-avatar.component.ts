import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';

export const forbiddenAvatarValidator = (control: AbstractControl): ValidationErrors | null => {
	const avatars = ['assets/img/profile.png'];
	return avatars.includes(control.value) ? { forbiddenAvatar: 'Bitte wählen Sie einen Avatar aus.' } : null;
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
	authService = inject(AuthService);
	router = inject(Router);
	avatarForm = this.fb.nonNullable.group({
		avatar: ['assets/img/profile.png', [Validators.required, forbiddenAvatarValidator]],
	});
	avatarSig = signal(this.avatarForm.get('avatar')!.value);

	errorMessage: string | null = null;

	constructor() {
		this.authService.checkUserStatus('select-avatar');
		this.avatarForm.get('avatar')!.valueChanges.subscribe((avatar) => {
			this.avatarSig.set(avatar);
		});
	}

	onSubmit(): void {
		const rawForm = this.avatarForm.getRawValue();
		this.authService.setAvatar(rawForm.avatar).subscribe({
			next: () => {
				this.router.navigateByUrl('/home');
			},
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}
}
