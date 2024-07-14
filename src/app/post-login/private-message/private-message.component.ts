import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ChatService } from '../../services/chat/chat.service';
import { Firestore} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { PrivateMessageListComponent } from '../home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from '../../services/communication/communication.service';
import { ChatHistoryComponent } from '../shared/chat-history/chat-history.component';



@Component({
  selector: 'app-private-message',
  standalone: true,
  imports: [ChatInputComponent, CommonModule, PrivateMessageListComponent, ChatHistoryComponent],
  templateUrl: './private-message.component.html',
  styleUrl: './private-message.component.scss'
})
export class PrivateMessageComponent implements OnInit{
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);

  constructor(private route: ActivatedRoute) {}



  ngOnInit(): void {
    this.route.params.subscribe((params) => {
			this.chatService.docRef = params['id'];
		});
    console.log('component initialised',this.chatService.docRef);
    // logic to get the chat history
  }


  handleClickOnMember(memberId: string) {
    this.communicationService.toggleUserProfileVisibility(true);
    this.communicationService.userProfileId = memberId;

  }

}



