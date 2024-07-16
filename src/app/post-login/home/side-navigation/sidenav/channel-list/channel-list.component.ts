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
 /**
 * Handles the click event on a channel.
 * Sets the relevant chat service properties and subscribes to the message list of the selected channel.
 *
 * @param {string} channelName - The name of the channel.
 * @param {string} chanId - The ID of the channel.
 */
  handleChannelClick(channelName: string, chanId: string) {
    this.chatService.mainCollection = 'channels';            // sets the main collection to 'channels'
    this.chatService.docRef = chanId;                        // sets the docRef to the channel id       
    this.selectedChannel= channelName;                       // sets the selected channel name to apply ngClass active       

    this.chatService.subscribeMsgList();                     // subscribes to the message list of the channel
    this.chatService.setPlaceholderName(channelName);        // sets the placeholder name for the shared inputfield to the channel name
  }

}
