import { Component, inject } from '@angular/core';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';
import { ChatService } from '../../services/chat/chat.service';
@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [ChatInputComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  chatService = inject(ChatService);
}
