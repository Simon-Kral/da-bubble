import { inject, Injectable, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { query, orderBy, where, Firestore, collection, doc, onSnapshot, updateDoc, getDocs } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../../post-login/private-message/private-message.component';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.class';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit{

  firebaseService = inject(FirebaseService);
  firestore: Firestore = inject(Firestore);

  msgList: Message[] = [];

  unsubscribeMsgList: any;
  

  //Dragan: channel details variables
  isChannelDetailsVisibleSource = new BehaviorSubject<boolean>(false);
  isChannelDetailsVisible$ = this.isChannelDetailsVisibleSource.asObservable();

  constructor() { }

  ngOnInit() {
    this.subscribeMsgList();
    console.log('Current Msg List:', this.msgList);
  }

  ngOnDestroy() {
    if (this.unsubscribeMsgList) {
      this.unsubscribeMsgList();
    }    // to-do: implement unsubscribe to private message list
  }

  onMessageSent(event: { message: string, source: string, destinationCollection:string, destinationDocRef:string, timestamp: number }) {
    console.log('Message sent from component:', event.source);
    console.log('Message sent by:', this.firebaseService.currentUser.userId );
    console.log('Message content:', event.message);
    console.log('Message destination collection:', event.destinationCollection);
    console.log('Message destination document reference:', event.destinationDocRef);
    console.log('Message timestamp:', event.timestamp);
    // Add logic to handle the sent message
  }


//Dragan
toggleChannelDetailsVisibility(visible: boolean) {
	  this.isChannelDetailsVisibleSource.next(visible);
}
/**
 * Subscribes to the messages subcollection and updates the message list in real-time.
 * Orders the messages by the 'time' field.
 * to-do: implemet better orderBy + variabel to subscribe wether to channels or private messages collection
 */
subscribeMsgList() {
  const q = query(this.getMsgSubColRef(), orderBy('time'));
  this.unsubscribeMsgList = onSnapshot(
    q,
    (snapshot) => {
      this.msgList = [];
      snapshot.forEach((doc) => {
        const msg = this.setMessage(doc.data(), doc.id);
          this.msgList.push(msg);
      });
      console.log('Msg List:', this.msgList);
    },
    (error) => {
      console.error('Error fetching channels: ', error);
    }
  );
}
/**
 * Gets a reference to the messages subcollection for the currently selected privateChats collection or the channels collection.
 * 
 * to-do: implement variabel  for channels or private messages collection
 */

getMsgSubColRef() {
  return collection(this.firestore,`privateChats/${this.firebaseService.selectedPrivateChatId}/messages`);
}
/**
 * Formats the message data into a Message object.
 * 
 * @param {any} obj - The message data from the Firestore document.
 * @param {string} id - The ID of the Firestore document.
 * @returns {Message} The formatted message object.
 */
setMessage(obj: any, id: string): Message{
  return {
    messageId: id || '',
    text: obj.text || '',
    chatId: obj.chatId || '',
    date: obj.date || '',
    time: obj.time || '',
    messageSendBy: obj.messageSendBy || '',
    messageAnswer: obj.messageAnswer || [],
    reactions: obj.reactions || [],
  };
}

}
