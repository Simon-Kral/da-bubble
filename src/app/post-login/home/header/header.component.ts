import { Component, EventEmitter, OnInit, Output, inject, output } from '@angular/core';
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
	firebaseService = inject(FirebaseService);

	//user profile
	@Output() userProfileToggle = new EventEmitter<boolean>();
	

	constructor() {
		this.authService.checkUserStatus();
	}

	//user profile functions
	toggleUserProfile(visible: boolean) {
		this.userProfileToggle.emit(visible);
	  }
	  
}
