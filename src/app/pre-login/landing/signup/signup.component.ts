import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  authService = inject(AuthService);
  firebase = inject(FirebaseService);
  firestore: Firestore = inject(Firestore);
  fb = inject(FormBuilder);
  router = inject(Router);

	signupForm = this.fb.nonNullable.group({
		username: ['', [Validators.required, Validators.minLength(5)]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
		privacy: [false, Validators.requiredTrue],
	});
	visibilityIcon: string = 'assets/img/icons/visibility_off.png';
	inputType: string = 'password';

	/**
	 * Submits the registration form and attempts to signup a new user.
	 * @returns {void}
	 */
	onSubmit(): void {
		const rawForm = this.signupForm.getRawValue();

    this.authService.signup(rawForm.email, rawForm.username, rawForm.password).subscribe({
      next: () => {
        this.firebase.setInitialDatabaseEntries(rawForm.username);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Checks if a form control is invalid and has been touched or is dirty.
   * @param {FormControl<string>} formControl - The form control to check.
   * @returns {boolean} True if the form control is invalid and touched or dirty, otherwise false.
   */
  formInvalid(formControl: FormControl<string> | FormControl<boolean>): boolean {
    return formControl.invalid && (formControl.touched || formControl.dirty);
  }

  changePasswordVisibility() {
    if (this.inputType === 'password') {
      this.inputType = 'text';
      this.visibilityIcon = 'assets/img/icons/visibility.png';
    } else {
      this.inputType = 'password';
      this.visibilityIcon = 'assets/img/icons/visibility_off.png';
    }
  }
}
