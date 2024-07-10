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
	channelCreatorName: string = '';
	channelDescription = '';
	channelName = '';


	ngOnInit(): void {
		this.getCurrentChannel();
		this.channelCreatorName = this.firebaseService.getUserDisplayName(this.channelToEdit.createdBy);

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
		console.log(
			'isChannelDescriptionEditable',
			this.isChannelDescriptionEditable
		);
	}

	saveChannelDescription() {
		this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
		console.log('saved channel description');
	}

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
		console.log('isChannelNameEditable', this.isChannelNameEditable);
	}

	saveChannelName() {
		if(this.checkChannelCreator()) {
			console.log('channel name changed');
			
		}
		this.isChannelNameEditable = !this.isChannelNameEditable;
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
