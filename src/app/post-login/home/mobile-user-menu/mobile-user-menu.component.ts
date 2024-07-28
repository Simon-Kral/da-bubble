import { Component, inject, Inject } from '@angular/core';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';
import { AppComponent } from '../../../app.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { ThreadService } from '../../../services/thread/thread.service';

@Component({
  selector: 'app-mobile-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-user-menu.component.html',
  styleUrl: './mobile-user-menu.component.scss'
})
export class MobileUserMenuComponent {

  communicationService = inject(CommunicationService);
  authService = inject(AuthService);
  appComponent = inject(AppComponent);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  threadService = inject(ThreadService);

  
  activeMenu: string = '';

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  async logout(): Promise<void> {
		// to-do OPTIONAL update user status to offline when close tab
		try {	
		if (this.authService.firebaseAuth.currentUser?.email != undefined) {
			this.appComponent.notificateUser('Abmelden');

		await this.firebaseService.unsubscribeAllLists();
		await this.chatService.unsubscribeAllLists();
		await this.threadService.unsubscribeAllLists();
		await this.firebaseService.updateUserStatus(false);

			this.authService.logout().subscribe({
				next: () => {
					sessionStorage.clear();
				},
				error: (err) => {
					console.log(err);
				},
			});
		} else {
		
			await this.firebaseService.unsubscribeAllLists();
			await this.chatService.unsubscribeAllLists();
			await this.threadService.unsubscribeAllLists();
			await this.firebaseService.updateUserStatus(false);	

			this.authService.logout().subscribe({
				next: () => {
					sessionStorage.clear();
				},
				error: (err) => {
					console.log(err);
				},
			});
		}
	} catch (error) {
		console.error('Error during cleanup before logout:', error);
	  }
	}
}
