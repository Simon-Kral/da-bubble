import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './../../../services/authentication/auth.service';
import { DynamicComponentService } from '../../../services/dynamic-component/dynamic-component.service';
import { ChooseAvatarComponent } from '../choose-avatar/choose-avatar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.nonNullable.group({
    'username': ['', Validators.required],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
    'privacy': ['', Validators.required]
  })

  errorMessage: string | null = null;

  constructor(private dynamicComponentService: DynamicComponentService) {}

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue()
    this.authService
      .register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe({
        next: () => {
          this.loadChooseAvatar();
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      })
  }

  loadChooseAvatar() {
    this.dynamicComponentService.setComponent(ChooseAvatarComponent);
  }
}
