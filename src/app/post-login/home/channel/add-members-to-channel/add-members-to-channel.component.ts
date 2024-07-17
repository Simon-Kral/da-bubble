import { SearchService } from './../../../../services/search/search.service';
import { ChatService } from './../../../../services/chat/chat.service';

import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ChannelMemberSelectionComponent } from "../../../shared/channel-member-selection/channel-member-selection.component";


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
		this.searchService.savedUserForChannel = [];
		
	}

	closeWindow(): void {
		this.searchService.savedUserForChannel = [];
		this.userName = '';
		this.addMembersToChannelVisibilityChange.emit(false);
	}

	checkIfUserIsAlreadyAdded(userId: string): boolean {
		return  this.searchService.savedUserForChannel.some((user) => user === userId) || this.firebaseService.channelList.some((channel) => channel.members.some((user) => user === userId));
	}

	toggleDisplayUsers() {
		this.searchService.memberSearchActive = !this.searchService.memberSearchActive;
	}

	saveAndCloseAddMembersToChannel(): void {
		this.searchService.addSavedUserToChannel();
		this.closeWindow();
	}

	
}
