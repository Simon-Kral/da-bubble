
import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';


@Component({
	selector: 'app-add-members-to-channel',
	standalone: true,
	imports: [FormsModule, NgClass, CommonModule],
	templateUrl: './add-members-to-channel.component.html',
	styleUrl: './add-members-to-channel.component.scss',
})
export class AddMembersToChannelComponent {
	@Input() isAddMembersToChannelVisible = false;
	@Output() addMembersToChannelVisibilityChange = new EventEmitter<boolean>();
	userName = '';
	firebaseService = inject(FirebaseService);
	displayUsers = false;

	closeWindow(): void {
		this.firebaseService.savedUserForChannel = [];
		this.userName = '';
		this.addMembersToChannelVisibilityChange.emit(false);
	}
	
	addUserToChannel(userId: string): void {
		console.log(userId);
		
	}

	onUserNameChange(userName: string): void {
		console.log(this.userName);
	}

	checkIfUserIsAlreadyAdded(userId: string): boolean {
		return this.firebaseService.savedUserForChannel.some((user) => user === userId);
	}

	toggleDisplayUsers() {
		this.displayUsers = !this.displayUsers;
	}
}
