import { Component, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-password-reset-request',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './password-reset-request.component.html',
	styleUrl: './password-reset-request.component.scss',
})
export class PasswordResetRequestComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	router = inject(Router);

	pwResetForm = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
	});

	errorMessage: string | null = null;

	onSubmit(): void {
		const rawForm = this.pwResetForm.getRawValue();
		this.authService.sendPasswordResetLink(rawForm.email).subscribe({
			next: () => {
				this.router.navigateByUrl('/');
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
}
