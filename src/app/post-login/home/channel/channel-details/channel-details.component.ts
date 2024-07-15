import { FormsModule } from '@angular/forms';
import { Channel } from './../../../../models/channel.class';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../../services/communication/communication.service';

@Component({
	selector: 'app-channel-details',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './channel-details.component.html',
	styleUrl: './channel-details.component.scss',
})
export class ChannelDetailsComponent {
	@Input() isChannelDetailsVisible = false;
	@Output() isChannelDetailsVisibleChange = new EventEmitter<boolean>();

	chatService = inject(ChatService);
	firebaseService = inject(FirebaseService);
	communicationService = inject(CommunicationService);
	isChannelNameEditable = false;
	isChannelDescriptionEditable = false;
	channelToEdit: Channel = new Channel();
	channelCreatorName = '';
	channelDescription = '';
	channelName = '';
	currentChannelName = this.firebaseService.getChannelName();

	ngOnInit(): void {
		this.getCurrentChannel();
		this.channelCreatorName = this.firebaseService.getUserDisplayName(
			this.channelToEdit.createdBy
		);
	}

	getCurrentChannel() {
		for (
			let index = 0;
			index < this.firebaseService.channelList.length;
			index++
		) {
			if (
				this.firebaseService.channelList[index].chanId ===
				this.firebaseService.currentChanId
			) {
				return (this.channelToEdit =
					this.firebaseService.channelList[index]);
			}
		}
		return null;
	}

	toggleChannelDescription() {
		this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
	}

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
	}

	saveChannelDescription() {
		if (this.checkChannelCreator()) {
			if (this.channelDescription !== '') {
				this.firebaseService.updateChannelDescription(
					this.channelDescription
				);
				this.channelToEdit.description = this.channelDescription;
			}
		}
		this.toggleChannelDescription();
	}

	saveChannelName() {
		if (this.checkChannelCreator()) {
			if (this.channelName !== '') {
				this.firebaseService.updateChannelName(this.channelName);
				this.channelToEdit.name = this.channelName;
			}
		}
		this.toggleIsChannelNameEditable();
	}

	checkChannelCreator() {
		return (
			this.channelToEdit.createdBy ===
			this.firebaseService.currentUser.userId
		);
	}

	closeDetailsWindow() {
		this.channelDescription = '';
		this.channelName = '';
		this.isChannelDetailsVisible = false;
		this.isChannelDetailsVisibleChange.emit(this.isChannelDetailsVisible);
	}

	leaveChannel() {
		this.firebaseService.leaveChannel();
		this.closeDetailsWindow();
	}

	/**
	 * Opens the user details based on the channel creator.
	 * If the current user is not the channel creator, it toggles the channel details visibility off,
	 * toggles the user profile visibility on, and sets the user profile ID to the channel creator's ID.
	 * If the current user is the channel creator, it toggles the channel details visibility off
	 * and toggles the current user profile visibility on.
	 */
	openUserDetails() {
		if(!this.checkChannelCreator()) {
			this.communicationService.toggleChannelDetailsVisibility(false)
			this.communicationService.toggleUserProfileVisibility(true);
			this.communicationService.userProfileId = this.channelToEdit.createdBy;
		} else {
			this.communicationService.toggleChannelDetailsVisibility(false);
			this.communicationService.toggleCurrentUserProfileVisibility(true);
		}
	}
}
