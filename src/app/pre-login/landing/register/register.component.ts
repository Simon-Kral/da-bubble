import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    'username': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
    'privacy': ['', Validators.required]
  })

  errorMessage: string | null = null;

  constructor() {}

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue()
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/avatar');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      })
  }
}
