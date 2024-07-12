import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';
import { ChatService } from '../../../../../services/chat/chat.service';
@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent implements OnInit, OnDestroy{

  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  selectedChannel: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void{
	
  }

  ngOnDestroy(): void{

  }
 
  handleChannelClick(channel: string, chanId: string) {
    this.selectedChannel= channel;
	  this.firebaseService.currentChanId = chanId;
    this.chatService.setPlaceholderName(channel);
  }

}
