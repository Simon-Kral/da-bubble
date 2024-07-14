import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../../services/communication/communication.service';
@Component({
  selector: 'app-channel-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-member.component.html',
  styleUrl: './channel-member.component.scss'
})
export class ChannelMemberComponent {
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService);
  @Input() isChannelMemberVisible: boolean = false;
  @Output() channelMemberVisibilityChange = new EventEmitter<boolean>();

  // Default icon sources
	close = '../../../../assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = '../../../../assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;

  /**
	 * Handles the mouse over event for the sideNav icons.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
  }

  handleClickOnMember(memberId: string) {
    this.communicationService.toggleChannelMemberVisibility(false);
    this.communicationService.toggleUserProfileVisibility(true);
    this.communicationService.userProfileId = memberId;
  }
}
