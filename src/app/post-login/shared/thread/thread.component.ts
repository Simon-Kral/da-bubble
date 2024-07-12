import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatHistoryComponent } from '../chat-history/chat-history.component';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [ChatHistoryComponent, CommonModule, ChatInputComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {


  constructor() {}

}
