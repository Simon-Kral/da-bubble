import {
	Component,
	EventEmitter,
	inject,
	Inject,
	Input,
	Output,
} from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { AppComponent } from '../../../app.component';
@Component({
	selector: 'app-user-menu',
	standalone: true,
	imports: [],
	templateUrl: './user-menu.component.html',
	styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
	authService = inject(AuthService);
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	communicationService = inject(CommunicationService);

	@Input() isUserMenuVisible: boolean = false;
	@Output() userMenuVisibilityChange = new EventEmitter<boolean>();

	constructor(public appComponent: AppComponent) {}

	async logout(): Promise<void> {
		// to-do OPTIONAL update user status to offline when close tab
		if (this.authService.firebaseAuth.currentUser?.email != undefined) {
			this.appComponent.notificateUser('Abmelden');
			await this.firebaseService.updateUserStatus(false);
			this.firebaseService.clearCurrentUser(); // to-do remove after developement is finished ?!? check first!
			this.firebaseService.unsubscribeAllLists();
			this.chatService.unsubscribeAllLists();
			this.authService.logout().subscribe({
				next: () => {
					sessionStorage.clear();
				},
				error: (err) => {
					console.log(err);
				},
			});
		} else {
			this.authService.logout().subscribe({
				next: () => {
					sessionStorage.clear();
				},
				error: (err) => {
					console.log(err);
				},
			});
		}
	}
}
