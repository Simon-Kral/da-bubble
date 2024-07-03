import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { getAuth } from '@angular/fire/auth';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, NgIf],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	router = inject(Router);

	loginForm = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});

	errorMessage: string | null = null;

	onSubmit(): void {
		const rawForm = this.loginForm.getRawValue();
		this.authService.login(rawForm.email, rawForm.password).subscribe({
			next: () => {
				this.authService.checkUserStatus('login');
				this.pushUserIdToSessionStorage();
			},
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}

	formInvalid(formControl: FormControl<string>) {
		return formControl.invalid && (formControl.touched || formControl.dirty);
	}

	pushUserIdToSessionStorage() {
		const auth = getAuth();
		const id = auth.currentUser!.uid;
		// const name = auth.currentUser!.displayName;
		// console.log('user', `'${name}'`, 'was pushed');
		sessionStorage.setItem(`currentUserId`, id);
	}
}
