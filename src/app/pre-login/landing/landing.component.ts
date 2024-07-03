import { Component, inject } from '@angular/core';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
	selector: 'app-landing',
	standalone: true,
	imports: [LandingHeaderComponent, LandingFooterComponent, RouterOutlet, NgIf],
	animations: [],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	authService = inject(AuthService);
	router = inject(Router);

	constructor() {
		this.authService.checkUserStatus('landing');
	}
}
