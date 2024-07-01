import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  })

  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.loginForm.getRawValue()
    this.authService
      .login(rawForm.email, rawForm.password)
      .subscribe({
        next: () => {
        this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      })
  }
}
