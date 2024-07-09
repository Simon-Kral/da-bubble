import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';

@Component({
  selector: 'app-channel-details',
  standalone: true,
  imports: [],
  templateUrl: './channel-details.component.html',
  styleUrl: './channel-details.component.scss'
})
export class ChannelDetailsComponent {

	@Input() isChannelDetailsVisible = false;
	@Output() isChannelDetailsVisibleChange = new EventEmitter<boolean>();

	
	chatService = inject(ChatService);

}
