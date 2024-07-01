import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink, FormsModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  avatar = new FormControl('assets/img/profile.png');

  avatarForm = this.fb.nonNullable.group({
    'avatar': ['assets/img/profile.png', Validators.required],
  })

  errorMessage: string | null = null;

  constructor() {}

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

  updateAvatar(avatar: string) {
    this.avatar.setValue('Nancy');
  }
}
