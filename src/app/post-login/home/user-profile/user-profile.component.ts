import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../services/chat/chat.service';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);

  @Input() isUserProfileVisible: boolean = false;
  @Output() userProfileVisibilityChange = new EventEmitter<boolean>();

  showDataOfUser = this.firebaseService.selectedPrivateChatCreatorId; 
  // Default icon sources
  close = 'assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = 'assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;

  closeUserProfile(): void {
    this.userProfileVisibilityChange.emit(false);
  }

  	/**
	 * Handles the mouse over event for the sideNav icons.
	 * Changes the icon source based on the provided image name.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
   * Changes the icon source based on the provided image name.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
	}

}
