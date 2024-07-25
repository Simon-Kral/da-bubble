import { inject, Injectable } from '@angular/core';
import { ChatService } from '../chat/chat.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CommunicationService } from '../communication/communication.service';
import {
  query,
  orderBy,
  Firestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  getDoc,
  increment,
  deleteDoc,
} from '@angular/fire/firestore';
import { MessageAnswer } from '../../models/messageAnswer.class';
import { Message } from '../../models/message.class';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private messageScrolledSource = new BehaviorSubject<string | null>(null);
  messageScrolled$ = this.messageScrolledSource.asObservable();

  constructor() {}

  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService);
  firestore: Firestore = inject(Firestore);

  msgAnswerList: MessageAnswer[] = [];
  unsubscribeMsgAnswerList: any;

  editMessageAnswerId: string = '';
  editMessageId: string = '';

  /**
   * Subscribes to all necessary lists for the thread service.
   */
  subscribeAllLists() {
    this.subscribeMsgAnswerList();
  }

  /**
   * Unsubscribes to all lists for the thread service.
   */
  unsubscribeAllLists() {
    if (this.unsubscribeMsgAnswerList) {
      this.unsubscribeMsgAnswerList();
    }
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
    const collectionRef = collection(
      this.firestore,
      this.chatService.mainCollection,
      this.chatService.docRef,
      'messages',
      this.chatService.messageId,
      'messageAnswers',
    );
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
      },
    );
  }

  /**
   * Formats the message data into a MessageAnswer object.
   *
   * @param {any} obj - The message data from the Firestore document.
   * @param {string} id - The ID of the Firestore document.
   * @returns {Message} The formatted message object.
   */
  setMessageAnswer(obj: any, id: string): MessageAnswer {
    return {
      messageAnswerId: id || '',
      text: obj.text || '',
      messageId: obj.messageId || '',
      date: obj.date || '',
      time: obj.time || '',
      messageSendBy: obj.messageSendBy || '',
      reactions: obj.reactions || [],
      editCount: obj.editCount || 0,
      lastEdit: obj.lastEdit || '',
      storageData: obj.storageData || '',
      taggedUser: obj.taggedUser || [],
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
      const messageDocRef = doc(
        this.firestore,
        `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.chatService.messageId}/messageAnswers/${this.editMessageAnswerId}`,
      );
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
      time: Date.now().toString(),
      messageSendBy: message.messageSendBy,
      reactions: [],
      editCount: 0,
      lastEdit: '',
      storageData: '',
      taggedUser: [],
    };
    const docRef = await this.addMessageAnswer(newMessage);
    await this.updateMessageAnswerId(docRef);
    await this.updateMessageAnswerCountAndTime(this.chatService.messageId, Date.now().toString(), 'increase');
    await this.chatService.updateMessageThreadId(message.messageId, docRef.id);
  }

  /**
   * Sends a new messageAnswer and updates its document ID in Firestore.
   *
   * @param {string} messageText - The text of the message answer to be sent.
   * @returns {Promise<void>} A promise that resolves when the message answer is successfully sent and updated.
   */
  async sendMessageAnswer(messageText: string) {
    let newMessage: MessageAnswer = {
      messageAnswerId: '',
      text: messageText,
      messageId: this.chatService.messageId,
      date: new Date().toLocaleDateString(),
      time: Date.now().toString(),
      messageSendBy: this.firebaseService.currentUser.userId,
      reactions: [],
      editCount: 0,
      lastEdit: '',
      storageData: '',
      taggedUser: this.chatService.taggedUser,
    };
    const docRef = await this.addMessageAnswer(newMessage);
    await this.updateMessageAnswerId(docRef);
    await this.updateMessageAnswerCountAndTime(this.chatService.messageId, Date.now().toString(), 'increase');
  }

  /**
   * Adds a new messageAnswer doc to the Firestore.
   *
   * @param {MessageAnswer} answerData - The message answer object to be added.
   * @returns {Promise<any>} A promise that resolves with the document reference of the added message answer.
   * @throws {Error} Throws an error if adding the document fails.
   */
  async addMessageAnswer(answerData: MessageAnswer): Promise<any> {
    try {
      const collectionRef = collection(
        this.firestore,
        this.chatService.mainCollection,
        this.chatService.docRef,
        'messages',
        this.chatService.messageId,
        'messageAnswers',
      );
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
      await updateDoc(
        doc(
          this.firestore,
          `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.chatService.messageId}/messageAnswers/${docRef.id}`,
        ),
        {
          messageAnswerId: docRef.id,
        },
      );
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
      const messageDocRef = doc(
        this.firestore,
        `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.chatService.messageId}/messageAnswers/${this.editMessageAnswerId}`,
      );
      await updateDoc(messageDocRef, {
        text: newText,
        editCount: increment(1),
        lastEdit: Date.now().toString(),
      });
    } catch (error) {
      console.error('Error updating message text:', error);
      throw error;
    }
  }

  /**
   * Updates the answer count and optionally the last answer time of a message document in Firestore.
   *
   * @param {string} messageId - The ID of the message document to be updated.
   * @param {string} time - The time of the last answer, represented as a string. Only used when the operation is 'increase'.
   * @param {string} operation - The operation to perform on the answer count ('increase' or 'decrease').
   * @returns {Promise<void>} A promise that resolves when the message document is successfully updated.
   * @throws Will throw an error if the update operation fails.
   */
  async updateMessageAnswerCountAndTime(
    messageId: string,
    time: string,
    operation: 'increase' | 'decrease',
  ): Promise<void> {
    try {
      const messageDocRef = doc(
        this.firestore,
        `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`,
      );
      const incrementValue = operation === 'increase' ? 1 : -1;
      const updateData: any = {
        answerCount: increment(incrementValue),
        lastAnswer: time,
      };
      await updateDoc(messageDocRef, updateData);
    } catch (error) {
      console.error(`Error ${operation}ing message document:`, error);
      throw error;
    }
  }

  /**
   * Updates the text of the initial message document in Firestore.
   * It increments the edit count and sets the last edit time to the current system time in milliseconds.
   * @param {string} newText - The new text to update in the message document.
   * @returns {Promise<void>} A promise that resolves when the message text is updated.
   * @throws Will throw an error if the update operation fails.
   */
  async updateInitialMessage(newText: string): Promise<void> {
    try {
      const messageDocRef = doc(
        this.firestore,
        `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.editMessageId}`,
      );
      await updateDoc(messageDocRef, {
        text: newText,
        editCount: increment(1),
        lastEdit: Date.now().toString(),
      });
    } catch (error) {
      console.error('Error updating message text:', error);
      throw error;
    }
  }

  /**
   * Deletes a message document from Firestore and updates the parent message's answer count.
   *
   * @returns {Promise<void>} A promise that resolves when the message is successfully deleted.
   * @throws Will throw an error if the deletion fails.
   */
  async deleteMessageAnswer(): Promise<void> {
    try {
      const messageDocRef = doc(
        this.firestore,
        `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.editMessageId}/messageAnswers/${this.editMessageAnswerId}`,
      );
      await deleteDoc(messageDocRef);
      const latestTime = await this.findLatestMsgTime();
      await this.updateMessageAnswerCountAndTime(this.editMessageId, latestTime, 'decrease');
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  //general helper functions

  /**
   * Handles the creation of a new thread for a given message.
   *
   * @param {Message} message - The message for which a new thread is being created.
   * @returns {Promise<void>} A promise that resolves when the thread is successfully created and subscribed.
   */
  async handleCreateThread(message: Message) {
    this.communicationService.isThreadVisible = false;
    this.communicationService.toggleThreadVisibility(true);
    this.chatService.messageId = message.messageId;
    this.createMessageAnswer(message);
    await this.subscribeMsgAnswerList();
  }

  /**
   * Opens an existing thread and subscribes to its message answers.
   *
   * @param {string} threadId - The ID of the thread to be opened.
   * @returns {Promise<void>} A promise that resolves when the thread is successfully opened and subscribed.
   */
  async openExistingThread(threadId: string) {
    this.communicationService.isThreadVisible = false;
    this.communicationService.toggleThreadVisibility(true);
    this.chatService.messageId = threadId;
    await this.subscribeMsgAnswerList();
  }

  /**
   * This function is triggered when a message is sent and it calls the sendMessageAnswer
   * function with the message text from the event.
   *
   * @param {{ message: string }} event - The event object containing the sent message text.
   * @returns {Promise<void>} A promise that resolves when the message is successfully sent.
   */
  async onMessageSent(event: { message: string }) {
    await this.sendMessageAnswer(event.message);
    this.scrollToBottom();
  }
  /**
   * Finds the latest message answer time in the list excluding the current message to be deleted.
   *
   * @returns {Promise<string>} A promise that resolves to the time of the latest message answer.
   */
  async findLatestMsgTime(): Promise<string> {
    const filteredList = this.msgAnswerList.filter((msg) => msg.messageAnswerId !== this.editMessageAnswerId);
    if (filteredList.length === 0) {
      return '';
    }
    const parseDateTime = (msg: MessageAnswer) => {
      const [day, month, year] = msg.date.split('.').map(Number);
      const time = parseInt(msg.time);
      return new Date(year, month - 1, day).getTime() + time;
    };
    const latestMsg = filteredList.sort((a, b) => parseDateTime(b) - parseDateTime(a))[0];
    return latestMsg.time;
  }

  /**
   * Scrolls to a specific message by its answer ID.
   *
   * @param {string} messageAnswerId - The ID of the message to scroll to.
   */
  scrollToMessage(messageAnswerId: string) {
    console.log('Scroll to message:', messageAnswerId);
    this.messageScrolledSource.next(messageAnswerId);
  }

  /**
   * Scrolls to the bottom of the message list.
   * Finds the last message in the list and scrolls to it.
   */
  scrollToBottom() {
    if (this.msgAnswerList.length === 0) {
      return;
    } else {
      const lastMessage = this.msgAnswerList[this.msgAnswerList.length - 1];
      const messageId = lastMessage.messageAnswerId;
      this.scrollToMessage(messageId);
    }
  }
}
