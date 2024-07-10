import { FormsModule} from '@angular/forms';
import { Channel } from './../../../../models/channel.class';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';



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
	isChannelNameEditable = false;
	isChannelDescriptionEditable = false;
	channelToEdit: Channel = new Channel();
	channelCreatorName = '';
	channelDescription = '';
	channelName = '';
	currentChannelName = this.firebaseService.getChannelName();


	ngOnInit(): void {
		this.getCurrentChannel();
		this.channelCreatorName = this.firebaseService.getUserDisplayName(this.channelToEdit.createdBy);
		console.log(this.currentChannelName);
		
	}


	getCurrentChannel() {
		for (let index = 0; index < this.firebaseService.channelList.length; index++) {
			if(this.firebaseService.channelList[index].chanId === this.firebaseService.currentChanId){
				console.log(this.firebaseService.channelList[index]);
				return this.channelToEdit = this.firebaseService.channelList[index];
			}
		}
		return null;
	}

	toggleChannelDescription() {
		this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
	}

	saveChannelDescription() {
		if(this.checkChannelCreator()) {
			if(this.channelDescription !== '') {
				this.firebaseService.updateChannelDescription(this.channelDescription);
				this.channelToEdit.description = this.channelDescription;
			}
		}
		this.toggleChannelDescription();
	}

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable
	}

	saveChannelName() {
		if(this.checkChannelCreator()) {
			if(this.channelName !== '') {
				this.firebaseService.updateChannelName(this.channelName);
				this.channelToEdit.name = this.channelName;
			}	
		}
		this.toggleIsChannelNameEditable();
	}

	checkChannelCreator() {
		return this.channelToEdit.createdBy === this.firebaseService.currentUser.userId;
	}

	closeDetailsWindow() {
		this.channelDescription = '';
		this.channelName = '';
		this.isChannelDetailsVisible = false;
		this.isChannelDetailsVisibleChange.emit(this.isChannelDetailsVisible);
	}


}
