import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-details.component.html',
  styleUrl: './channel-details.component.scss'
})
export class ChannelDetailsComponent {

	@Input() isChannelDetailsVisible = false;
	@Output() isChannelDetailsVisibleChange = new EventEmitter<boolean>();

	
	chatService = inject(ChatService);

	isChannelNameEditable = false;

	toggleIsChannelNameEditable() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
		console.log('isChannelNameEditable', this.isChannelNameEditable);
	}

	saveChannelName() {
		this.isChannelNameEditable = !this.isChannelNameEditable;
		console.log('saved channel name');
	}
}
