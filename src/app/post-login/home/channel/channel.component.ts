import { CommunicationService } from './../../../services/communication/communication.service';
import { FirebaseService } from './../../../services/firebase/firebase.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../../shared/chat-input/chat-input.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ChannelDetailsComponent } from './channel-details/channel-details.component';
import { ChatHistoryComponent } from '../../shared/chat-history/chat-history.component';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user.class';
@Component({
	selector: 'app-channel',
	standalone: true,
	imports: [
		CommonModule,
		ChatInputComponent,
		ChannelDetailsComponent,
		ChatHistoryComponent,
	],
	templateUrl: './channel.component.html',
	styleUrl: './channel.component.scss',
})
export class ChannelComponent {
	chatService = inject(ChatService);
	communicationService = inject(CommunicationService);
	firebaseService = inject(FirebaseService);
	showChannelDetails = false;
	showAddMembersToChannel = false;
	channelId: string = '';
	hashtag = 'assets/img/icons/hashtag_chat_inactive.png';
	dropdownArrow = 'assets/img/icons/keyboard_arrow_down_inactive.png';
	currentChannel = this.firebaseService.getChannelById(
		this.firebaseService.currentChanId
	);
	usersId: string[] = [];

	users: any[] = [];

	constructor(private route: ActivatedRoute) {
		this.usersId = this.firebaseService.getAllMembers();
		this.getAllUsersDataFromId();
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.firebaseService.currentChanId = params['id'];
		});
	}

	/**
	 * Returns the left style value for a chat component item based on the given index.
	 * @param index - The index of the chat component item.
	 * @returns The left style value as a string.
	 */
	getLeftStyleValue(index: number): string {
		return (index * 28).toString();
	}

	handleMessage(message: object): void {
		console.log(message);
	}

	toggleShowChannelDetails() {
		this.communicationService.toggleChannelDetailsVisibility(
			!this.showChannelDetails
		);
	}

	toggleImgSrc() {
		this.hashtag =
			this.hashtag === 'assets/img/icons/hashtag_chat_inactive.png'
				? 'assets/img/icons/hashtag_chat_active.png'
				: 'assets/img/icons/hashtag_chat_inactive.png';
		this.dropdownArrow =
			this.dropdownArrow ===
			'assets/img/icons/keyboard_arrow_down_inactive.png'
				? 'assets/img/icons/keyboard_arrow_up_active.png'
				: 'assets/img/icons/keyboard_arrow_down_inactive.png';
	}

	toggleAddMembersToChannel() {
		this.communicationService.toggleAddMembersToChannelVisibility(
			!this.showAddMembersToChannel
		);
	}

	/**
	 * Retrieves data of all users from their IDs and adds them to the users array.
	 */
	getAllUsersDataFromId() {
		this.currentChannel?.members.forEach((element) => {
			let user = this.firebaseService.getUserById(element);
			this.users.push(user);
		});
	}
}
