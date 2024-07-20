import { inject, Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CommunicationService } from '../communication/communication.service';
import { query, orderBy, where, Firestore, collection, doc, onSnapshot, updateDoc, getDocs, addDoc, getDoc } from '@angular/fire/firestore';
import { MessageAnswer } from '../../models/messageAnswer.class';
import { Message } from '../../models/message.class';
@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor() { }

  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService);
  firestore: Firestore = inject(Firestore);

  messageId: string = '';  // This is the message ID that the thread is related to
  threadId: string = '';  // This is the thread ID that the thread is related to

  createThread(message: Message) {
    console.log('Thread created for message: ' + message.messageId);
    this.communicationService.toggleThreadVisibility(true);
    this.messageId = message.messageId;
    this.createMessageAnswer(message);
  }

  openExistingThread(threadId: string) {
    console.log('Thread opened for thread: ' + threadId);
    this.communicationService.toggleThreadVisibility(true);
    this.messageId = threadId;
  }


  async createMessageAnswer(message: Message) {
    let newMessage: MessageAnswer = {
      messageAnswerId: '',
      text: message.text,
      messageId: message.messageId,
      date: new Date().toLocaleDateString(),
      time: message.time,
      messageSendBy: message.messageSendBy,
      reactions: []
    };
      const docRef = await this.addMessageAnswer(newMessage);
      console.log('Document written with ID: ', docRef.id);
      await this.updateMessageAnswerId(docRef);
      console.log('Document updated with ID: ', docRef.id);
  }

  async addNewMessageAnswer(message: Message) {
    let newMessage: MessageAnswer = {
      messageAnswerId: '',
      text: '',
      messageId: message.messageId,
      date: new Date().toLocaleDateString(),
      time: message.time,
      messageSendBy: message.messageSendBy,
      reactions: []
    };
      const docRef = await this.addMessageAnswer(newMessage);
      console.log('Document written with ID: ', docRef.id);
      await this.updateMessageAnswerId(docRef);
      console.log('Document updated with ID: ', docRef.id);
  }

  
  async addMessageAnswer( answerData: MessageAnswer): Promise<any> {
    try {
      const collectionRef = collection(this.firestore, this.chatService.mainCollection, this.chatService.docRef, 'messages', this.messageId, 'messageAnswers');
      return addDoc(collectionRef, answerData);
    } catch (e) {
    console.error('Error adding message document: ', e);
    throw e;
    }
  }

  async updateMessageAnswerId(docRef: any): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, this.chatService.mainCollection, this.chatService.docRef, 'messages', this.messageId, 'messageAnswers', docRef.id), {
        messageAnswerId: docRef.id,
      });
      console.log('Message document updated with ID: ', docRef.id);
    } catch (e) {
      console.error('Error updating message document: ', e);
      throw e;
    }
  }
}
