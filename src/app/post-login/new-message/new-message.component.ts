import { Component } from '@angular/core';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [ChatInputComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {

}
