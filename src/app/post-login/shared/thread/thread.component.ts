import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ThreadHistoryComponent } from '../thread-history/thread-history.component';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { CommunicationService } from '../../../services/communication/communication.service';
import { ThreadService } from '../../../services/thread/thread.service';
import { ChatService } from '../../../services/chat/chat.service';
@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [ThreadHistoryComponent, CommonModule, ChatInputComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  communicationService = inject(CommunicationService);
  threadService = inject(ThreadService);
  chatService = inject(ChatService);
  constructor() {}

  // Default icon sources
    close = 'assets/img/icons/close_black.png';
  // Hover icon sources
    closeHover = 'assets/img/icons/close_blue.png';
  // current Icon Source
    currentIconSourceClose = this.close;


    /**
	 * Handles the mouse over event for the sideNav icons.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
  }

  handleClickOnClose() {
    console.log('handleClickOnClose');
    this.communicationService.toggleThreadVisibility(true);
    this.threadService.unsubscribeAllLists();

  }
}
