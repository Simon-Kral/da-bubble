import { from } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Channel } from './../../../../models/channel.class';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../../services/communication/communication.service';

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
	channelToEdit: Channel = new Channel();
	channelCreatorName = '';
	currentChannelName = this.firebaseService.getChannelName();
	form: FormGroup;

	constructor(private fb : FormBuilder) {
		this.form = this.fb.group({
			channelName: new FormControl(this.channelToEdit.name, [Validators.minLength(2),  Validators.pattern('^[^ ]{0,1}[^\s]{1,}$')]),
			channelDescription: new FormControl(this.channelToEdit.description, [Validators.minLength(2)]),
		});
		this.getCurrentChannel();
	}

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

	saveChannelDescription(channelDescription: string) {
		if (this.checkChannelCreator()) {
			if (channelDescription !== '') {
				this.firebaseService.updateChannelDescription(
					channelDescription
				);
				this.channelToEdit.description = channelDescription;
			}
		}
		this.toggleChannelDescription();
	}

	saveChannelName(channelName: string) {
		if (this.checkChannelCreator()) {
			if (channelName !== '') {
				this.firebaseService.updateChannelName(channelName);
				this.channelToEdit.name = channelName;
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
		this.form.reset();
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
			this.communicationService.userProfileId = this.channelToEdit.createdBy;
			this.communicationService.toggleChannelDetailsVisibility(false)
			this.communicationService.toggleUserProfileVisibility(true);
		} else {
			this.communicationService.toggleChannelDetailsVisibility(false);
			this.communicationService.toggleCurrentUserProfileVisibility(true);
		}
	}

	/**
	 * Handles the form submission event.
	 * If the channel name is provided, it saves the channel name.
	 * If the channel description is provided, it saves the channel description.
	 * Resets the form after saving the data.
	 */
	onSubmit() {
		if(this.form.get('channelName')?.value && this.form.value.channelName) {
			this.saveChannelName(this.form.get('channelName')?.value);			
		}
		if(this.form.get('channelDescription')?.value && this.form.value.channelDesct) {
			this.saveChannelDescription(this.form.get('channelDescription')?.value);
		}
		this.form.reset();
	}
}
