import { SearchService } from './../../../../services/search/search.service';
import { ChatService } from './../../../../services/chat/chat.service';

import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ChannelMemberSelectionComponent } from "../../../shared/channel-member-selection/channel-member-selection.component";
import { doc, updateDoc } from '@angular/fire/firestore';


@Component({
	selector: 'app-add-members-to-channel',
	standalone: true,
	imports: [FormsModule, NgClass, CommonModule, ChannelMemberSelectionComponent],
	templateUrl: './add-members-to-channel.component.html',
	styleUrl: './add-members-to-channel.component.scss',
})
export class AddMembersToChannelComponent {
	@Input() isAddMembersToChannelVisible = false;
	@Output() addMembersToChannelVisibilityChange = new EventEmitter<boolean>();
	userName = '';
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	searchService = inject(SearchService);
	displayUsers = false;

	ngOnDestroy(): void {
		this.searchService.memberSearchActive = false;
		this.searchService.selectedUser = [];
		this.userName = '';
	}

	closeWindow(): void {
		this.addMembersToChannelVisibilityChange.emit(false);
	}

	checkIfUserIsAlreadyAdded(userId: string): boolean {
		return  this.searchService.savedUserForChannel.some((user) => user === userId) || this.firebaseService.channelList.some((channel) => channel.members.some((user) => user === userId));
	}

	toggleDisplayUsers() {
		this.searchService.memberSearchActive = !this.searchService.memberSearchActive;
	}

		/**
	 * Adds the saved user to the current channel.
	 * to-do might be outsourced to channel component
	 */
		addSavedUserToChannel() {
			const channelDocRef = doc(
				this.firebaseService.firestore,`channels/${this.chatService.docRef}`
			);
			updateDoc(channelDocRef, { members: this.searchService.combineMembers() });
			this.searchService.selectedUser = [];
		}
	

	saveAndCloseAddMembersToChannel(): void {
		this.addSavedUserToChannel();
		this.closeWindow();
	}

	
}
