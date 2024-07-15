import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { PrivateChat } from '../../../../../models/privateChat.class';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';
import { ChatService } from '../../../../../services/chat/chat.service';
import { User } from '../../../../../models/user.class';
import { PrivateMessageComponent } from '../../../../private-message/private-message.component';
import { CommunicationService } from '../../../../../services/communication/communication.service';
@Component({
  selector: 'app-private-message-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './private-message-list.component.html',
  styleUrl: './private-message-list.component.scss'
})
export class PrivateMessageListComponent implements OnInit, OnDestroy{

  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);
  
  constructor(private router: Router, private route: ActivatedRoute) {

   }

  ngOnInit(): void{

  }

  ngOnDestroy(): void {

  }

/**
 * Handles the click event on a private note message.
 * Sets the relevant chat service properties and subscribes to the message list of the selected private note.
 * @param {string} messageId - The ID of the private note message.
 */
  handleNoteMessageClick(messageId: string) {
    this.chatService.mainCollection = 'privateNotes';                             // sets the main collection to 'privateNotes'
    this.chatService.docRef = messageId;                                          // sets the docRef to the message id                   
    this.chatService.subscribeMsgList();                                          // subscribes to the message list of the private note       to-do: do we need that?
    this.chatService.setPlaceholderName(this.firebaseService.currentUser.name) ;  // sets the placeholder name for the shared inputfield to the current user name
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
    this.chatService.subscribeMsgList();                                                          // subscribes to the message list of the private chat    to-do: do we need that?
    this.chatService.setPlaceholderName(this.firebaseService.getUserDisplayName(chatCreator));    // sets the placeholder name for the shared inputfield to the chat creator name
  }
}
