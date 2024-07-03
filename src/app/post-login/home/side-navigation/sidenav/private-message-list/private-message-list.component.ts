import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { PrivateChat } from '../../../../../models/privateChat.class';


@Component({
  selector: 'app-private-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-message-list.component.html',
  styleUrl: './private-message-list.component.scss'
})
export class PrivateMessageListComponent implements OnInit, OnDestroy{

  firestore: Firestore = inject(Firestore);

  privateMsgList: PrivateChat[] = [];
  privateChat = new PrivateChat();
  unsubscribePrivateMsgList: any;

/*   privateMsgList = [
    { user: 'Hans', avatarUrl: 'assets/img/character-images/character_1.png', onlineStatus: 'online', id: '1' },
    { user: 'Otto', avatarUrl: 'assets/img/character-images/character_2.png', onlineStatus: 'offline', id: '2'},
    { user: 'Karl', avatarUrl: 'assets/img/character-images/character_3.png', onlineStatus: 'online', id: '3' }
  ];
 */
  currentUser = [
    { name: 'Sofia', photoURL: 'assets/img/character-images/character_3.png', onlineStatus: 'online', id: '4'}
  ];

  selectedConversation: string | null = null;


  constructor(private router: Router) { }

  ngOnInit(): void{
    this.subPrivateMsgList();
  }

  ngOnDestroy(): void {

  }

  navigateToPrivateConversation(conversation: string) {
    this.selectedConversation= conversation;
    console.log('Navigating to conversation with', conversation);
  }

  subPrivateMsgList() {
    const q = query(this.getPrivateChatRef(), orderBy('name'));
    this.unsubscribePrivateMsgList = onSnapshot(q, (snapshot) => {
      this.privateMsgList = [];
      snapshot.forEach(doc => {
        this.privateMsgList.push(this.setPrivateChat(doc.data(), doc.id));
      });
      console.log('Private Chat List:', this.privateMsgList);
    }, (error) => {
      console.error("Error fetching private chats: ", error);
    });
  }

  getPrivateChatRef() {
    return collection(this.firestore, 'privateChats');
  }

  setPrivateChat(obj: any, id: string,): PrivateChat {
    return {
      privatChatId: id || "",
      chatCreator: obj.chatCreator || "",
      chatReciver: obj.chatReciver || "",
      messages: obj.messages || [],
      createdAt: obj.createdAt || "",
      createdBy: obj.createdBy || "",
    }
  }
}
