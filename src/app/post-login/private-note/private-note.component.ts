import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ChatService } from '../../services/chat/chat.service';
import { CommunicationService } from '../../services/communication/communication.service';
import { ActivatedRoute } from '@angular/router';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';
import { CommonModule } from '@angular/common';
import { PrivateMessageListComponent } from '../home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { ChatHistoryComponent } from '../shared/chat-history/chat-history.component';

@Component({
  selector: 'app-private-note',
  standalone: true,
  imports: [ChatInputComponent, CommonModule, PrivateMessageListComponent, ChatHistoryComponent],
  templateUrl: './private-note.component.html',
  styleUrl: './private-note.component.scss'
})
export class PrivateNoteComponent {
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);

  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
  }


  handleClickOnMember(visible: boolean) {
    this.communicationService.toggleCurrentUserProfileVisibility(visible);
  }

}
