import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
	isChannelNameEditable = false;
	isChannelDescriptionEditable = false;
	channelToEdit = this.chatService.getCurrentChannel()
	currentChannelName = this.chatService.getChannelName();
	channelCreatorName = this.firebaseService.getUserDisplayName(this.channelToEdit?.createdBy || '');	
	form: FormGroup;

	constructor(private fb : FormBuilder) {
		this.form = this.fb.group({
			channelName: new FormControl('', [Validators.minLength(2),  Validators.pattern('^[^ ]{0,1}[^\s]{1,}$')]),
			channelDescription: new FormControl(this.channelToEdit?.description, [Validators.minLength(2)]),
		});
		
	}

	ngOnInit(): void {
		
	}


	toggleChannelDescription() {
		this.isChannelDescriptionEditable = !this.isChannelDescriptionEditable;
	}

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
	}

	checkChannelCreator() {
		return (
			this.channelToEdit?.chanId ===
			this.firebaseService.currentUser.userId
		);
	}

	closeChannelDetails() {
		this.form.reset();
		this.isChannelDetailsVisibleChange.emit(false);
	}

		/**
	 * Leaves the current channel by removing the current user from the channel's members list.
	 */
		leaveChannel() {
			const channelDocRef = doc(this.firebaseService.firestore,`channels/${this.chatService.docRef}`);
			updateDoc(channelDocRef, {
				members: this.firebaseService.channelList
					.find((channel) => channel.chanId === this.chatService.docRef)
					?.members.filter((member) => member !== this.firebaseService.currentUserId),
			});
		}

}
