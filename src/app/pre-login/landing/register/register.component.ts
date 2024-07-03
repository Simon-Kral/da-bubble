import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    privacy: [false, Validators.requiredTrue],
  });

  errorMessage: string | null = null;

  constructor() {}

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue();
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.authService.checkUserStatus();
        },
        error: (err) => {
          this.errorMessage = err.code;
        },
      });
  }

  formInvalid(formControl: FormControl<string> | FormControl<boolean>) {
    return formControl.invalid && (formControl.touched || formControl.dirty);
  }
}
