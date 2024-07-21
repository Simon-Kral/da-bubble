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

  msgAnswerList: MessageAnswer[] = []; // will get used to store msgAnswers from prvt chats or channels
  unsubscribeMsgAnswerList: any;

  editMessageAnswerId:string = '';  // will get used to store the id of the message that should get edited


  subscribeAllLists() {
    this.subscribeMsgAnswerList();
  }

  unsubscribeAllLists() {
    if (this.unsubscribeMsgAnswerList) {
      this.unsubscribeMsgAnswerList();
    }
  }

  async handleCreateThread(message: Message) {
    console.log('Thread created for message: ' + message.messageId);
    this.communicationService.toggleThreadVisibility(true);
    this.messageId = message.messageId;
    this.createMessageAnswer(message);
    await this.subscribeMsgAnswerList();
  }

  async openExistingThread(threadId: string) {
    console.log('Thread opened for thread: ' + threadId);
    this.communicationService.toggleThreadVisibility(true);
    this.messageId = threadId;
    await this.subscribeMsgAnswerList();
  }
  

  async onMessageSent(event: { message: string, source: string, timestamp: number }) {
    this.sendMessageAnswer(event.message, event.timestamp);
  }
// code for fetching messages of subcollection "messageAnswers" from privateChats / privateNotes  or channels
/**
 * Subscribes to the messageAns subcollection and updates the message list in real-time.
 * Orders the messages by the 'date' and then 'time' field.
 */
subscribeMsgAnswerList() {
  if (this.unsubscribeMsgAnswerList) {
    this.unsubscribeMsgAnswerList();
  }
  const collectionRef = collection(this.firestore, this.chatService.mainCollection, this.chatService.docRef, 'messages', this.messageId, 'messageAnswers');
  const q = query(collectionRef, orderBy('date'), orderBy('time'));
  this.unsubscribeMsgAnswerList = onSnapshot(
    q,
    (snapshot) => {
      this.msgAnswerList = [];
      snapshot.forEach((doc) => {
        const msg = this.setMessageAnswer(doc.data(), doc.id);
          this.msgAnswerList.push(msg);
      });
      console.log('MsgAnswers List:', this.msgAnswerList);
    },
    (error) => {
      console.error('Error fetching messages: ', error);
    }
  );
}

/**
 * Formats the message data into a MessageAnswer object.
 * 
 * @param {any} obj - The message data from the Firestore document.
 * @param {string} id - The ID of the Firestore document.
 * @returns {Message} The formatted message object.
 */
setMessageAnswer(obj: any, id: string): MessageAnswer{
  return {
    messageAnswerId: id || '',
    text: obj.text || '',
    messageId: obj.messageId || '',
    date: obj.date || '',
    time: obj.time || '',
    messageSendBy: obj.messageSendBy || '',
    reactions: obj.reactions || [],
  };
}
  /**
   * Retrieves the text of a message from a specific doc in Firestore.
   * @param {string} mainCollection - The name of the main collection.
   * @param {string} docRef - The document reference in the main collection.
   * @param {string} editMessageId - The ID of the message document in the subcollection.
   * @returns {Promise<string>} A promise that resolves to the text of the message.
   */
  async getMessageAnswer(): Promise<string> {
    try {
      const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.messageId}/messageAnswers/${this.editMessageAnswerId}`);
      const docSnap = await getDoc(messageDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data['text'] || '';
      } else {
        throw new Error('No such document!');
      }
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  /**
   * Creates a initial messageAnswer in the Firestore subcollection 'messageAnswers' for privateChats / privateNotes  or channels.
   * 
   * @param {Message} message - The message object containing the details of the messageAnswer to be created.
   * @returns {Promise<void>} A promise that resolves when the message answer is successfully created and updated.
   */
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
    /**
   * Sends a new messageAnswer and updates its document ID in Firestore.
   * 
   * @param {string} messageText - The text of the message answer to be sent.
   * @param {number} time - The time the message answer is sent, represented as a number.
   * @returns {Promise<void>} A promise that resolves when the message answer is successfully sent and updated.
   */
    async sendMessageAnswer(messageText: string, time:number) {
      let newMessage: MessageAnswer = {
        messageAnswerId: '',
        text: messageText,
        messageId: this.messageId,
        date: new Date().toLocaleDateString(),
        time: time.toString(),
        messageSendBy: this.firebaseService.currentUser.userId,
        reactions: []
      };
        const docRef = await this.addMessageAnswer(newMessage);
        console.log('Document written with ID: ', docRef.id);
        await this.updateMessageAnswerId(docRef);
        console.log('Document updated with ID: ', docRef.id);
    }
 /**
   * Adds a new messageAnswer doc to the Firestore.
   * 
   * @param {MessageAnswer} answerData - The message answer object to be added.
   * @returns {Promise<any>} A promise that resolves with the document reference of the added message answer.
   * @throws {Error} Throws an error if adding the document fails.
   */
  async addMessageAnswer( answerData: MessageAnswer): Promise<any> {
    try {
      const collectionRef = collection(this.firestore, this.chatService.mainCollection, this.chatService.docRef, 'messages', this.messageId, 'messageAnswers');
      return addDoc(collectionRef, answerData);
    } catch (e) {
    console.error('Error adding message document: ', e);
    throw e;
    }
  }
  /**
   * Updates the messageAnswerId field of a message answer in the Firestore.
   * 
   * @param {any} docRef - The document reference of the message answer to be updated.
   * @returns {Promise<void>} A promise that resolves when the messageAnswerId field is successfully updated.
   * @throws {Error} Throws an error if updating the document fails.
   */
  async updateMessageAnswerId(docRef: any): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.messageId}/messageAnswers/${docRef.id}`), {
        messageAnswerId: docRef.id,
      });
      console.log('Message document updated with ID: ', docRef.id);
    } catch (e) {
      console.error('Error updating message document: ', e);
      throw e;
    }
  }

  /**
 * Updates the text of a message in a specific doc in Firestore.
 * @param {string} mainCollection - The name of the main collection.
 * @param {string} docRef - The document reference in the main collection.
 * @param {string} messageId - The ID of the message document in the subcollection messages.
 * @param {string} editMessageAnswerId - The ID of the message document in the subcollection messageAnswers.
 * @param {string} newText - The new text to update in the message document.
 * @returns {Promise<void>} A promise that resolves when the message text is updated.
 */
async updateMessageAnswer(newText: string): Promise<void> {
  try {
    const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.messageId}/messageAnswers/${this.editMessageAnswerId}`);
    await updateDoc(messageDocRef, {
      text: newText
    });
    console.log('Message text updated successfully');
  } catch (error) {
    console.error('Error updating message text:', error);
    throw error;
  }
}
}
