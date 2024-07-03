import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	authService = inject(AuthService);
	router = inject(Router);
	errorMessage: string | null = null;

	constructor() {
		this.authService.checkUserStatus('header');
	}

	logout(): void {
		this.authService.logout().subscribe({
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}
}
