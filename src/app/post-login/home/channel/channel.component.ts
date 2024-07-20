import { CommunicationService } from './../../../services/communication/communication.service';
import { FirebaseService } from './../../../services/firebase/firebase.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../../shared/chat-input/chat-input.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ChannelDetailsComponent } from './channel-details/channel-details.component';
import { ChatHistoryComponent } from '../../shared/chat-history/chat-history.component';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user.class';
import { ChannelMemberComponent } from './channel-member/channel-member.component';
@Component({
	selector: 'app-channel',
	standalone: true,
	imports: [
		CommonModule,
		ChatInputComponent,
		ChannelDetailsComponent,
		ChatHistoryComponent,
		ChannelMemberComponent
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
	hashtag = 'assets/img/icons/hashtag_chat_inactive.png';
	dropdownArrow = 'assets/img/icons/keyboard_arrow_down_inactive.png';




	
	@Input() isChannelMemberVisible: boolean = false;
	@Output() channelMemberVisibilityChange = new EventEmitter<boolean>();

	constructor(private route: ActivatedRoute) {
		this.route.params.subscribe((params) => {
			this.chatService.docRef = params['id'];
		});
    console.log('component initialised',this.chatService.docRef);

    // to-do settimeout is needed in case user refreshes the page, otherwise the placeholder is not set because the channelList is not yet loaded
    setTimeout(() => {
    this.chatService.initializeChannelPlaceholder(this.chatService.docRef);
  }, 1500);
	}

	ngOnInit(): void {
	}

	/**
	 * Returns the left style value for a chat component item based on the given index.
	 * @param index - The index of the chat component item.
	 * @returns The left style value as a string.
	 */
	getLeftStyleValue(index: number): string {
		if(index === 0) {
			return (.5 * 21).toString();

		}else if(index === 1) {
			return (index * 35).toString();
		}else {
			return (index * 30).toString();
		}
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

	handleClickOnMember() {
		console.log('Member clicked');
		this.communicationService.toggleChannelMemberVisibility(true);
	}

	
}
