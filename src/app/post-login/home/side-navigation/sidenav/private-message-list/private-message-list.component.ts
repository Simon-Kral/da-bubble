import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  
  selectedMessageId: string | null = null;



  constructor(private router: Router) {
   }

  ngOnInit(): void{

  }

  ngOnDestroy(): void {

  }

  handleNoteMessageClick(messageId: string) {
    this.chatService.mainCollection = 'privateChats';
    this.chatService.docRef = messageId;
    this.chatService.subscribeMsgList();
    this.communicationService.togglePrivateNote(true); 
    this.chatService.setPlaceholderName(this.firebaseService.currentUser.name) ;
  }

  handlePrivateMessageClick(messageId: string, chatCreator: string) {
    this.chatService.mainCollection = 'privateChats';
    this.chatService.docRef = messageId;
    this.chatService.subscribeMsgList();  
    this.firebaseService.getChatCreatorIdByDocRef(messageId);
    this.communicationService.togglePrivateNote(false);
    this.chatService.setPlaceholderName(this.firebaseService.getUserDisplayName(chatCreator));   
  }
}
