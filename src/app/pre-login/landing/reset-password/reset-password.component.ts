import { Component, inject } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export let comparePasswords = (
	control: AbstractControl
): ValidationErrors | null => {
	return control.get('password')?.value !=
		control.get('confirmPassword')?.value
		? { comparePasswords: '*Die Passwörter müssen übereinstimmen.' }
		: null;
};

@Component({
	selector: 'app-reset-password',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	router = inject(Router);

	pwResetForm = this.fb.nonNullable.group(
		{
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: [''],
		},
		{ validators: comparePasswords }
	);

	errorMessage: string | null = null;

	constructor(private route: ActivatedRoute) {}

	onSubmit(): void {
		const rawForm = this.pwResetForm.getRawValue();
		this.route.queryParams.subscribe((params) => {
			const actionCode = params['oobCode'];
			this.authService
				.resetPassword(actionCode, rawForm.password)
				.subscribe({
					next: () => {
						this.router.navigateByUrl('/');
					},
					error: (err) => {
						this.errorMessage = err.code;
					},
				});
		});
	}

	formInvalid(formControl: FormControl<string>) {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}
}
