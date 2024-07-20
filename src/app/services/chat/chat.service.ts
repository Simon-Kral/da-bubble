import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { query, orderBy, where, Firestore, collection, doc, onSnapshot, updateDoc, getDocs, addDoc, getDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../../post-login/private-message/private-message.component';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message.class';
import { PrivateChat } from '../../models/privateChat.class';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search/search.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  firebaseService = inject(FirebaseService);
  firestore: Firestore = inject(Firestore);
  

  msgList: Message[] = [];  // will get used to store msgs from prvt chats or channels
  msgAnswerList: Message[] = []; // will get used to store msgAnswers from prvt chats or channels

  unsubscribeMsgList: any;
  unsubscribeMsgAnswerList: any;

  //variabel for new private chat 
  newPrivateChatId: string = '';

  //variable for placeholder Name of shared input field
  placeholderName: string = '';
// variable fto store ID of chatReciver
chatCreator = '';

	// variabels needed for chathistory (editing msg´s)
	mainCollection:string = '';  // will get used to store name of maincollection (privateChats or channels)

	docRef:string = '';  // will get used to store the docRef of the currently displayed doc (privateChats or channels)

  editMessageId:string = '';  // will get used to store the id of the message that should get edited

  selectedPrivateChatReciver: string = '';  // will get used to store the id of the selected private chat reciver


 

  constructor(private router: Router, private route: ActivatedRoute) { 
  }

    


  subscribeAllLists() {
    this.subscribeMsgList();
  }

  unsubscribeAllLists() {
    if (this.unsubscribeMsgList) {
      this.unsubscribeMsgList();
    }
    if (this.unsubscribeMsgAnswerList) {
      this.unsubscribeMsgAnswerList();
    }
  }


  async onMessageSent(event: { message: string, source: string, timestamp: number }) {
    console.log('Message sent from component:', event.source);                    
    console.log('Message sent by:', this.firebaseService.currentUser.userId );
    console.log('Message content:', event.message);
    console.log('Message timestamp:', event.timestamp);

    switch (event.source) {
      case 'privateMessage':
        this.sendMessage(event.message, event.timestamp);   
        break;
      case 'privateNote':
        this.sendMessage(event.message, event.timestamp);   
        break;

      case 'channel':
        this.sendMessage(event.message, event.timestamp);   
        break;  

      case 'newMessage':
        if (this.mainCollection === 'privateChats') {
          await this.initializePrivateChat(this.firebaseService.currentUser.userId, this.selectedPrivateChatReciver);
          await this.sendMessage(event.message, event.timestamp);
        } 
        
        else if (this.mainCollection === 'channels') {  
        this.sendMessage(event.message, event.timestamp);
        this.router.navigate(['/home/channels', this.docRef]);
        }
        break; 
        default:
        console.warn('Invalid destination collection:');
        break;
    }
  }
  

// code for fetching messages from private chat or channels
/**
 * Subscribes to the messages subcollection and updates the message list in real-time.
 * Orders the messages by the 'date' and then 'time' field.
 */
subscribeMsgList() {
  if (this.unsubscribeMsgList) {
    this.unsubscribeMsgList();
  }
  const collectionRef = collection(this.firestore, this.mainCollection, this.docRef, 'messages');
  const q = query(collectionRef, orderBy('date'), orderBy('time'));
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
      console.error('Error fetching messages: ', error);
    }
  );
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
  async getMessage(): Promise<string> {
    try {
      const messageDocRef = doc(this.firestore, `${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}`);
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
 * Updates the text of a message in a specific doc in Firestore.
 * @param {string} mainCollection - The name of the main collection.
 * @param {string} docRef - The document reference in the main collection.
 * @param {string} editMessageId - The ID of the message document in the subcollection.
 * @param {string} newText - The new text to update in the message document.
 * @returns {Promise<void>} A promise that resolves when the message text is updated.
 */
async updateMessage(newText: string): Promise<void> {
  try {
    const messageDocRef = doc(this.firestore, `${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}`);
    await updateDoc(messageDocRef, {
      text: newText
    });
    console.log('Message text updated successfully');
  } catch (error) {
    console.error('Error updating message text:', error);
    throw error;
  }
}

// general helper functions code to display messages
/**
 * Formats a Unix timestamp string into the format "HH:mm Uhr".
 *
 * @param {string} timestampStr - The Unix timestamp string to be formatted.
 * @returns {string} The formatted time string in the format "HH:mm Uhr".
 * @throws {Error} Throws an error if the input format is incorrect.
 */
formatTimeString(timestampStr: string): string {
  const timestamp = parseInt(timestampStr, 10);
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} Uhr`;
}

//code for privateChats
/**
 * Checks if a chat between the chatCreator and chatReceiver already exists.
 * If the chat exists, navigates to the existing chat.
 * If the chat does not exist, creates a new chat in the Firestore database updateds to new doc with its own Id and navigates to it.
 * @param {string} chatCreator - The user ID of the person initiating the chat.
 * @param {string} chatReceiver - The user ID of the person receiving the chat invitation.
 * @returns {Promise<void>} A promise that resolves when the new chat has been created and updated.
 */
async initializePrivateChat(chatCreator: string, chatReceiver: string) {
  try {
    const existingChatId = await this.checkIfPrivateChatExists(chatReceiver, chatCreator);
    if (this.redirectIfChatExists(existingChatId)) {
      return;
    }

    let newPrivateChat: PrivateChat = {
      privatChatId: '',
      chatCreator: chatCreator,
      chatReciver: chatReceiver,
    };

    const docRef = await this.addPrivateChat(newPrivateChat);
    await this.updatePrivateChatId(docRef);
  } catch (error) {
    console.error('Error starting new private chat:', error);
    throw error;
  }
}

/**
 * Adds a new private chat document to the Firestore database & redirects to the newly created chat.
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
    this.router.navigate(['/home/privateChats', docRef.id]);
    return docRef;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
}
/**
 * Checks if a private chat between the given chatCreator and chatReceiver exists.
 * @param {string} chatReceiver - The ID of the chat receiver.
 * @param {string} chatCreator - The ID of the chat creator.
 * @returns {Promise<string | null>} A promise that resolves to the chat ID if the chat exists, otherwise null.
 */
checkIfPrivateChatExists(chatReceiver: string, chatCreator: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    try {
      const existingChat = this.firebaseService.privateChatList.find(chat => 
        (chat.chatCreator === chatCreator && chat.chatReciver === chatReceiver) ||
        (chat.chatCreator === chatReceiver && chat.chatReciver === chatCreator)
      );
      if (existingChat) {
        resolve(existingChat.privatChatId);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Redirects to an existing chat if it exists.
 * @param {string | null} existingChatId - The ID of the existing chat, or null if no chat exists.
 * @returns {boolean} True if redirected, otherwise false and a new chat is created and navigated to.
 */
redirectIfChatExists(existingChatId: string | null): boolean {
  if (existingChatId) {
    this.router.navigate(['/home/privateChats', existingChatId]);
    return true;
  }
  return false;
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

/**
 * Initializes the  placeholder name based on the provided chat ID for the shared inputfiled.
 * If the current user is the chat creator, sets the chat receiver to the chat receiver from the chat data.
 * Otherwise, sets the chat receiver to the chat creator.
 * Sets the chat placeholder name based on the chat creator's user ID.
 * Retrieves the display name of the user corresponding to `chatCreator` and assigns it to `placeholderName`.
 * @param {string} chatId - The ID of the chat to initialize the placeholder for.
 */
initializeChatPlaceholder(chatId: string): void {
  const chatData = this.firebaseService.privateChatList.find(chat => chat.privatChatId === chatId);
  if (chatData) {
    if (chatData.chatCreator === this.firebaseService.currentUserId) {
      this.chatCreator = chatData.chatReciver;
    } else {
      this.chatCreator = chatData.chatCreator;
    }
    let placeholderName = this.firebaseService.getUserDisplayName(this.chatCreator);
    this.placeholderName = placeholderName;
  } else {
    console.warn('Chat not found or chatCreator field does not exist in the chat data!');
  }
}

/**
* Initializes the channel placeholder name based on the provided channel ID for the shared inputfiled.
* Searches for the channel in the `channelList` using the `channelId` and sets the `placeholderName` to the channel's name.
* @param {string} channelId - The ID of the channel to initialize the placeholder for.
*/
initializeChannelPlaceholder(channelId: string): void {
  const channelData = this.firebaseService.channelList.find(channel => channel.chanId === channelId);
  if (channelData) {
    this.placeholderName = channelData.name;
  } else {
    console.warn('Channel not found or name field does not exist in the channel data!');
  }
}

/**
 * Sends a message to a private chat or channel by creating a new message document in the messages subcollection.
 * @param {string} messageText - The text of the message to be sent.
 * @param {number} time - The timestamp of the message.
 * @returns {Promise<void>} A promise that resolves when the message has been successfully sent and updated.
 */
  async sendMessage(messageText:string, time:number) {
      let newMessage: Message = {
        messageId: '',
        text: messageText,
        chatId: this.docRef,
        date: new Date().toLocaleDateString(),
        time: time.toString(),
        messageSendBy: this.firebaseService.currentUser.userId,
        reactions: []
      };

        const docRef = await this.addMessage(newMessage);
        await this.updateMessageId(docRef);
    }

 /**
 * Adds a new message document to the messages subcollection of a private chat or a channel.
 *
 * @param {Message} messageData - The data of the new message.
 * @returns {Promise<any>} A promise that resolves with the document reference of the newly added message.
 */
addMessage(messageData: Message): Promise<any> {
	try {
	const collectionRef = collection(this.firestore, this.mainCollection, this.docRef, 'messages');
	return addDoc(collectionRef, messageData);
	} catch (e) {
	console.error('Error adding message document: ', e);
	throw e;
	}
}
    
/**
 * Updates the message document with its own ID in the messages subcollection of a private chat.
 *
 * @param {any} docRef - The document reference of the newly added message.
 * @returns {Promise<void>} A promise that resolves when the document has been successfully updated.
 * @throws {Error} Throws an error if updating the document fails.
 * 
 */
  async updateMessageId(docRef: any): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, this.mainCollection, this.docRef, 'messages', docRef.id), {
        messageId: docRef.id,
      });
      console.log('Message document updated with ID: ', docRef.id);
    } catch (e) {
      console.error('Error updating message document: ', e);
      throw e;
    }
  }
































  //code for channels



  // to do do we need that really?
	getCurrentChannel() {
		return this.firebaseService.channelList.find(
			(channel) => channel.chanId === this.docRef
		);
	
	}


  // to-do move to firebase service 

	getChannelNameById(channelId: string) {
		return this.firebaseService.channelList.find((channel) => channel.chanId === channelId)?.name;
	}
  



}
