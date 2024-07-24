import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';
import { ChatService } from '../../../../../services/chat/chat.service';
import { CommunicationService } from '../../../../../services/communication/communication.service';
import { ThreadService } from '../../../../../services/thread/thread.service';
@Component({
  selector: 'app-private-message-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './private-message-list.component.html',
  styleUrl: './private-message-list.component.scss'
})
export class PrivateMessageListComponent {

  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);
  threadService = inject(ThreadService);

  constructor() { }


/**
 * Handles the click event on a private note message.
 * Sets the relevant chat service properties and subscribes to the message list of the selected private note.
 * @param {string} messageId - The ID of the private note message.
 */
  handleNoteMessageClick(messageId: string) {
    this.chatService.mainCollection = 'privateNotes';                             // sets the main collection to 'privateNotes'
    this.chatService.docRef = messageId;                                          // sets the docRef to the message id                   
    this.chatService.subscribeMsgList();                                          // subscribes to the message list of the private note   
    this.chatService.placeholderName = this.firebaseService.getUserDisplayName(this.firebaseService.currentUserId) +' (Du)';   // sets the placeholder name to 'currentUserDisplayName'
    this.communicationService.isThreadVisible = false;
    this.threadService.unsubscribeAllLists();
    this.threadService.msgAnswerList = [];
  }

/**
 * Handles the click event on a private chat message.
 * Sets the relevant chat service properties and subscribes to the message list of the selected private chat.
 * Also sets the user profile ID and placeholder name for the shared input field.
 * @param {string} messageId - The ID of the private chat message.
 * @param {string} chatCreator - The user ID of the chat creator.
 */
  handlePrivateMessageClick(messageId: string, chatCreator: string) {
    this.chatService.mainCollection = 'privateChats';                                             // sets the main collection to 'privateChats'
    this.chatService.docRef = messageId;                                                          // sets the docRef to the message id
    this.communicationService.userProfileId = chatCreator;                                        // sets the user profile id to the chat creator
    this.chatService.subscribeMsgList();                                                          // subscribes to the message list of the private chat  
    this.chatService.initializeChatPlaceholder(messageId);
    this.communicationService.isThreadVisible = false;
    this.threadService.unsubscribeAllLists();
    this.threadService.msgAnswerList = [];
  }
}
