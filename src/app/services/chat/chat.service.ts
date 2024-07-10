import { inject, Injectable, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { query, orderBy, where, Firestore, collection, doc, onSnapshot, updateDoc, getDocs, addDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../../post-login/private-message/private-message.component';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.class';
import { PrivateChat } from '../../models/privateChat.class';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  firebaseService = inject(FirebaseService);
  firestore: Firestore = inject(Firestore);

  msgList: Message[] = [];  // will get used to store msgs from prvt chats or channels

  unsubscribeMsgList: any;

  //variabel for new private chat 
  newPrivateChatId: string = '';
  

  //Dragan: channel details variables to-do: outsource to communiction service
  isChannelDetailsVisibleSource = new BehaviorSubject<boolean>(false);
  isChannelDetailsVisible$ = this.isChannelDetailsVisibleSource.asObservable();
  //Dragan to-do: outsource to communiction service
toggleChannelDetailsVisibility(visible: boolean) {
  this.isChannelDetailsVisibleSource.next(visible);
}

  constructor() { }




  onMessageSent(event: { message: string, source: string, destinationCollection:string, destinationDocRef:string, timestamp: number }) {
    console.log('Message sent from component:', event.source);
    console.log('Message sent by:', this.firebaseService.currentUser.userId );
    console.log('Message content:', event.message);
    console.log('Message destination collection:', event.destinationCollection);
    console.log('Message destination document reference:', event.destinationDocRef);
    console.log('Message timestamp:', event.timestamp);
    // Add logic to handle the sent message
  }



// code for fetching messages from private chat or channels
/**
 * Subscribes to the messages subcollection and updates the message list in real-time.
 * Orders the messages by the 'time' field.
 * to-do: implemet better orderBy + variabel to subscribe wether to channels or private messages collection
 */
subscribeMsgList() {
  if (this.unsubscribeMsgList) {
    this.unsubscribeMsgList();
  }
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

//code for privateChats
/**
 * Starts a new private chat by creating a new chat document in the Firestore database.
 *
 * @param {string} chatCreator - The user ID of the person initiating the chat.
 * @param {string} chatReceiver - The user ID of the person receiving the chat invitation.
 * @param {string} component - The component from which the function is called.
 * @returns {Promise<void>} A promise that resolves when the new chat has been created and updated.
 * to-do implement logic to wether create a new chat from user profile with empty message or from new-message component with message
 */
  async startNewPrivateChat(chatCreator: string, chatReceiver: string, component: string) {
      
      let newPrivateChat: PrivateChat = {
        privatChatId: '',
        chatCreator: chatCreator,
        chatReciver: chatReceiver,
        privateNoteCreator: '',
        messages:  [],
        createdAt: '',
        createdBy: chatCreator
      };

        const docRef = await this.addPrivateChat(newPrivateChat);
        await this.updatePrivateChatId(docRef);
      }
/**
 * Adds a new private chat document to the Firestore database.
 *
 * @param {PrivateChat} privateChatData - The data for the new private chat.
 * @returns {Promise<any>} A promise that resolves with the document reference of the newly added chat.
 * @throws {Error} Throws an error if adding the document fails.
 */
    async addPrivateChat(privateChatData: PrivateChat): Promise<any> {
      try {
        const docRef = await addDoc(
           collection(this.firestore, 'privateChats'),
          privateChatData
        );
         console.log('Document added with ID: ', docRef.id);
         return docRef;
      } catch (e) {
         console.error('Error adding document: ', e);
         throw e;
       }
     }
/**
 * Updates the private chat document with its own ID in the Firestore database.
 *
 * @param {any} docRef - The document reference of the newly added private chat.
 * @returns {Promise<void>} A promise that resolves when the document has been successfully updated.
 * @throws {Error} Throws an error if updating the document fails.
 */
    async updatePrivateChatId(docRef: any): Promise<void> {
      try {
        await updateDoc(doc(this.firestore, 'privateChats', docRef.id), {
          id: docRef.id,
        });
        this.newPrivateChatId = docRef.id;
        console.log('Document updated with ID: ', docRef.id);
      } catch (e) {
        console.error('Error updating document: ', e);
        throw e;
      }
    }
    
    }