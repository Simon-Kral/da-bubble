import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';


@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {

	authService = inject(AuthService);
  firebaseService = inject(FirebaseService);

  @Input() isUserMenuVisible: boolean = false;
  @Output() userMenuVisibilityChange = new EventEmitter<boolean>();
  
  @Input() isCurrentUserProfileVisible: boolean = false;
  @Output() currentUserProfileVisibilityChange = new EventEmitter<boolean>();

  errorMessage: string | null = null; // to-do remove after testing is finished

  logout(): void {
    // to-do OPTIONAL update user status to offline when close tab
    this.firebaseService.updateUserStatus(false);
		this.firebaseService.clearCurrentUser(); // to-do remove after developement is finished
		this.firebaseService.ngOnDestroy(); 
		this.authService.logout().subscribe({
			error: (err) => {
				this.errorMessage = err.code;
			},
		});
	}

  toggleCurrentUserProfile(visible: boolean) {
    this.currentUserProfileVisibilityChange.emit(visible);
  }
}
