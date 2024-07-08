import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { PrivateChat } from '../../../../../models/privateChat.class';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';
import { ChatService } from '../../../../../services/chat/chat.service';
import { User } from '../../../../../models/user.class';
import { PrivateMessageComponent } from '../../../../private-message/private-message.component';
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

  selectedMessageId: string | null = null;
  

  constructor(private router: Router) {
   }

  ngOnInit(): void{

  }

  ngOnDestroy(): void {

  }

  onMessageClick(messageId: string) {
    this.selectedMessageId = messageId;
  }

}
