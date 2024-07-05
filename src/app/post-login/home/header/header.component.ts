import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	authService = inject(AuthService);
	router = inject(Router);
	errorMessage: string | null = null;
	firebaseService = inject(FirebaseService);

	constructor() {
		this.authService.checkUserStatus();
	}

	logout(): void {
		this.firebaseService.clearCurrentUser();
		this.firebaseService.ngOnDestroy(); // not working -->To-Do unsub all list before logging-out
		this.authService.logout().subscribe({
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}
}
