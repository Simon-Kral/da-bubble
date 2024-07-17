import { SearchService } from './../../../../services/search/search.service';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Channel } from './../../../../models/channel.class';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../../services/communication/communication.service';
import { doc, updateDoc } from 'firebase/firestore'; // Add this import

@Component({
	selector: 'app-channel-details',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	templateUrl: './channel-details.component.html',
	styleUrl: './channel-details.component.scss',
})
export class ChannelDetailsComponent {
	@Input() isChannelDetailsVisible = false;
	@Output() isChannelDetailsVisibleChange = new EventEmitter<boolean>();

	chatService = inject(ChatService);
	firebaseService = inject(FirebaseService);
	communicationService = inject(CommunicationService);
	searchService = inject(SearchService);
	isChannelNameEditable = false;
	isChannelDescriptionEditable = false;
	channelToEdit: Channel = this.chatService.getCurrentChannel() || new Channel();
	currentChannelName = this.chatService.getChannelName();
	channelCreatorName = this.firebaseService.getUserDisplayName(
		this.channelToEdit?.createdBy || ''
	);
	channelName: FormGroup;
	channelDescription: FormGroup;

	constructor(private fb: FormBuilder) {
		this.channelName = this.fb.group({
			chanName: new FormControl('', [
				Validators.minLength(2),
				Validators.required,
				Validators.pattern('^(?!\\s\\s).*$'),
			]),
		});

		this.channelDescription = this.fb.group({
			chanDescription: new FormControl('', [
				Validators.minLength(2),
				Validators.required,
				Validators.pattern('^(?!\\s\\s).*$'),
			]),
		});

		this.channelName.setValue({ chanName: this.channelToEdit?.name });
		this.channelDescription.setValue({
			chanDescription: this.channelToEdit?.description,
		});
	}

	ngOnInit(): void {}

	toggleChannelDescription() {
		this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
	}

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
	}

	checkChannelCreator() {
		return (
			this.channelToEdit?.createdBy ===
			this.firebaseService.currentUser.userId
		);
	}

	closeChannelDetails() {
		this.channelName.reset();
		this.channelDescription.reset();
		this.isChannelDetailsVisibleChange.emit(false);
	}

	/**
	 * Leaves the current channel by removing the current user from the channel's members list.
	 */
	leaveChannel() {
		const channelDocRef = doc(
			this.firebaseService.firestore,
			`channels/${this.chatService.docRef}`
		);
		updateDoc(channelDocRef, {
			members: this.firebaseService.channelList
				.find((channel) => channel.chanId === this.chatService.docRef)
				?.members.filter(
					(member) => member !== this.firebaseService.currentUserId
				),
		});
	}

	handleDescriptionChange() {
		if (
			this.channelToEdit?.description !==
			this.channelDescription.value.chanDescription.trim()
		) {
			const channelDocRef = doc(
				this.firebaseService.firestore,
				`channels/${this.chatService.docRef}`
			);
			updateDoc(channelDocRef, {description: this.channelDescription.value.chanDescription.trim()});
			this.toggleChannelDescription();
		}
	}

	handleNameChange() {
		if (this.channelToEdit?.name !== this.channelName.value.chanName.trim()) {
			const channelDocRef = doc(this.firebaseService.firestore,`channels/${this.chatService.docRef}`);
			updateDoc(channelDocRef, {name: this.channelName.value.chanName.trim()});
			this.toggleIsChannelNameEditable();
		}
	}

	openUserDetails() {
		if (!this.checkChannelCreator()) {
			this.communicationService.toggleChannelDetailsVisibility(false);
			this.communicationService.toggleUserProfileVisibility(true);
		} else {
			this.communicationService.toggleChannelDetailsVisibility(false);
			this.communicationService.toggleCurrentUserProfileVisibility(true);
		}
	}

	getChannelDescriptionById(channelId: string) {
		return this.firebaseService.channelList.find((channel) => channel.chanId === channelId)?.description;
	}
}
