import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';
import { ChatService } from '../../../../../services/chat/chat.service';
import { CommunicationService } from '../../../../../services/communication/communication.service';
import { ThreadService } from '../../../../../services/thread/thread.service';
@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss',
})
export class ChannelListComponent {
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);
  threadService = inject(ThreadService);
  selectedChannel: string | null = null;

  constructor() {}

  /**
   * Handles the click event on a channel.
   * Sets the relevant chat service properties and subscribes to the message list of the selected channel.
   *
   * @param {string} channelName - The name of the channel.
   * @param {string} chanId - The ID of the channel.
   */
  handleChannelClick(channelName: string, chanId: string) {
    this.chatService.mainCollection = 'channels';
    this.chatService.docRef = chanId;
    this.selectedChannel = channelName;
    this.chatService.initializeChannelPlaceholder(chanId);
    this.chatService.subscribeMsgList();
    this.communicationService.isThreadVisible = false;
    this.threadService.unsubscribeAllLists();
    this.threadService.msgAnswerList = [];
    
    this.communicationService.toggleSidenav();
    this.communicationService.isWelcomeScreenVisible = false;
  }
}
