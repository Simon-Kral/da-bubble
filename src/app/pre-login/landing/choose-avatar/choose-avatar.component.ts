import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicComponentService } from '../../../services/dynamic-component/dynamic-component.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { RegisterComponent } from '../register/register.component';
import { getAuth, updateProfile } from '@angular/fire/auth';
import { from } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  avatarForm = this.fb.nonNullable.group({
    'avatar': ['', Validators.required],
  })

  errorMessage: string | null = null;

  constructor(private dynamicComponentService: DynamicComponentService) {}

  onSubmit(): void {
    const rawForm = this.avatarForm.getRawValue();
    this.authService
      .setAvatar(rawForm.avatar)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      })
  }

  loadRegister() {
    this.dynamicComponentService.setComponent(RegisterComponent);
  }
}
