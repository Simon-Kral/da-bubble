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
import { Router } from '@angular/router';

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

	onSubmit(): void {
		const rawForm = this.pwResetForm.getRawValue();
		this.authService.resetPassword(rawForm.password);
	}

	formInvalid(formControl: FormControl<string>) {
		return (
			formControl.invalid && (formControl.touched || formControl.dirty)
		);
	}
}
//mode=resetPassword
//oobCode=8W7Nq8nbHKu3D1MwPd0T-dz0tIKXZNWxid3T2z2NesgAAAGQhFhg5Q
//apiKey=AIzaSyDlnzbLdBSdYINIBM1v4OcfHW2Pr-LPBH4
