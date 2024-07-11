
import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseService } from './../../../../services/firebase/firebase.service';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgClass } from '@angular/common';



@Component({
	selector: 'app-add-members-to-channel',
	standalone: true,
	imports: [FormsModule, NgClass],
	templateUrl: './add-members-to-channel.component.html',
	styleUrl: './add-members-to-channel.component.scss',
})
export class AddMembersToChannelComponent {
	@Input() isAddMembersToChannelVisible = false;
	@Output() addMembersToChannelVisibilityChange = new EventEmitter<boolean>();
	userName = '';
	firebaseService = inject(FirebaseService);

	closeWindow(): void {
		this.userName = '';
		this.addMembersToChannelVisibilityChange.emit(false);
	}

}
