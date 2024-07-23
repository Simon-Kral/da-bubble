import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import {
	query,
	orderBy,
	where,
	Firestore,
	collection,
	doc,
	onSnapshot,
	updateDoc,
	getDocs,
	addDoc,
	getDoc,
	deleteDoc,
	increment,
	DocumentReference,
	arrayUnion,
} from '@angular/fire/firestore';
import { Message } from '../../models/message.class';
import { PrivateChat } from '../../models/privateChat.class';
import { ActivatedRoute, Router } from '@angular/router';
import { Reaction } from '../../models/reaction.class';
@Injectable({
	providedIn: 'root',
})
export class ChatService {
	firebaseService = inject(FirebaseService);
	firestore: Firestore = inject(Firestore);

	msgList: Message[] = [];

	unsubscribeMsgList: any;
	unsubscribeMsgAnswerList: any;
	newPrivateChatId: string = '';
	placeholderName: string = '';
	chatCreator = '';
	mainCollection: string = '';
	docRef: string = '';
	editMessageId: string = '';
	editThreadId: string = '';
	messageId: string = '';
	selectedPrivateChatReciver: string = '';
	weekday = [
		'Sonntag',
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag',
	];
	months = [
		'Januar',
		'Februar',
		'März',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Dezember',
	];

	constructor(private router: Router, private route: ActivatedRoute) {}

	subscribeAllLists() {
		this.subscribeMsgList();
	}

	unsubscribeAllLists() {
		if (this.unsubscribeMsgList) {
			this.unsubscribeMsgList();
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
		const collectionRef = collection(
			this.firestore,
			this.mainCollection,
			this.docRef,
			'messages'
		);
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
	setMessage(obj: any, id: string): Message {
		return {
			messageId: id || '',
			text: obj.text || '',
			chatId: obj.chatId || '',
			date: obj.date || '',
			time: obj.time || '',
			messageSendBy: obj.messageSendBy || '',
			reactions: obj.reactions || [],
			threadId: obj.threadId || '',
			answerCount: obj.answerCount || 0,
			lastAnswer: obj.lastAnswer || '',
			editCount: obj.editCount || 0,
			lastEdit: obj.lastEdit || '',
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
			const messageDocRef = doc(
				this.firestore,
				`${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}`
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
	 * Updates the text of a message in a specific doc in Firestore.
	 * @param {string} mainCollection - The name of the main collection.
	 * @param {string} docRef - The document reference in the main collection.
	 * @param {string} editMessageId - The ID of the message document in the subcollection.
	 * @param {string} newText - The new text to update in the message document.
	 * @returns {Promise<void>} A promise that resolves when the message text is updated.
	 */
	async updateMessage(newText: string): Promise<void> {
		try {
			const messageDocRef = doc(
				this.firestore,
				`${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}`
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
	 * Updates the text of a thread messageAnswer document in Firestore.
	 *
	 * This function updates the text of a message in the messageAnswer subcollection.
	 * It increments the edit count and sets the last edit time to the current system time in milliseconds.
	 *
	 * @param {string} newText - The new text to update in the thread message document.
	 * @param {string} threadId - The ID of the thread message document to be updated.
	 * @returns {Promise<void>} A promise that resolves when the thread message text is updated.
	 * @throws Will throw an error if the update operation fails.
	 */
	async updateInitialThreadMessage(
		newText: string,
		threadId: string
	): Promise<void> {
		try {
			const messageDocRef = doc(
				this.firestore,
				`${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}/messageAnswers/${threadId}`
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
	 * Deletes a message document from Firestore, including all documents in the messageAnswers subcollection.
	 *
	 * @returns {Promise<void>} A promise that resolves when the message and its subcollection are successfully deleted.
	 * @throws Will throw an error if the deletion fails.
	 */
	async deleteMessage(): Promise<void> {
		try {
			const messageDocRef = doc(
				this.firestore,
				`${this.mainCollection}/${this.docRef}/messages/${this.editMessageId}`
			);

			await this.deleteSubcollection(messageDocRef);
			await deleteDoc(messageDocRef);
		} catch (error) {
			console.error('Error deleting message:', error);
			throw error;
		}
	}

	/**
	 * Deletes all documents in a given subcollection.
	 *
	 * @param {DocumentReference} messageDocRef - A reference to the message document whose subcollection is to be deleted.
	 * @returns {Promise<void>} A promise that resolves when the subcollection is successfully deleted.
	 * @throws Will throw an error if the deletion fails.
	 */
	async deleteSubcollection(messageDocRef: DocumentReference): Promise<void> {
		try {
			const subcollectionRef = collection(
				messageDocRef.firestore,
				messageDocRef.path,
				'messageAnswers'
			);
			const querySnapshot = await getDocs(subcollectionRef);
			const deletePromises = querySnapshot.docs.map((doc) =>
				deleteDoc(doc.ref)
			);
			await Promise.all(deletePromises);
		} catch (error) {
			console.error('Error deleting subcollection:', error);
			throw error;
		}
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
			const existingChatId = await this.checkIfPrivateChatExists(
				chatReceiver,
				chatCreator
			);
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
	checkIfPrivateChatExists(
		chatReceiver: string,
		chatCreator: string
	): Promise<string | null> {
		return new Promise((resolve, reject) => {
			try {
				const existingChat = this.firebaseService.privateChatList.find(
					(chat) =>
						(chat.chatCreator === chatCreator &&
							chat.chatReciver === chatReceiver) ||
						(chat.chatCreator === chatReceiver &&
							chat.chatReciver === chatCreator)
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
				privatChatId: docRef.id,
			});
			this.newPrivateChatId = docRef.id;
		} catch (e) {
			console.error('Error updating document: ', e);
			throw e;
		}
	}

	/**
	 * Sends a message to a private chat or channel by creating a new message document in the messages subcollection.
	 * @param {string} messageText - The text of the message to be sent.
	 * @returns {Promise<void>} A promise that resolves when the message has been successfully sent and updated.
	 */
	async sendMessage(messageText: string) {
		let newMessage: Message = {
			messageId: '',
			text: messageText,
			chatId: this.docRef,
			date: this.convertDate(),
			time: Date.now().toString(),
			messageSendBy: this.firebaseService.currentUser.userId,
			reactions: [],
			threadId: '',
			answerCount: 0,
			lastAnswer: '',
			editCount: 0,
			lastEdit: '',
		};
		const docRef = await this.addMessage(newMessage);
		await this.updateMessageId(docRef);
	}

	convertDate() {
		const date = new Date();
		return `${this.weekday[date.getDay()]}, ${date.getDate()}. ${
			this.months[date.getMonth()]
		}`;
	}

	/**
	 * Adds a new message document to the messages subcollection of a private chat or a channel.
	 *
	 * @param {Message} messageData - The data of the new message.
	 * @returns {Promise<any>} A promise that resolves with the document reference of the newly added message.
	 */
	addMessage(messageData: Message): Promise<any> {
		try {
			const collectionRef = collection(
				this.firestore,
				this.mainCollection,
				this.docRef,
				'messages'
			);
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
			await updateDoc(
				doc(
					this.firestore,
					this.mainCollection,
					this.docRef,
					'messages',
					docRef.id
				),
				{
					messageId: docRef.id,
				}
			);
		} catch (e) {
			console.error('Error updating message document: ', e);
			throw e;
		}
	}

	/**
	 * This function sets the threadId field of a specific message document to the provided threadId.
	 *
	 * @param {string} messageId - The ID of the message document to be updated.
	 * @param {string} threadId - The thread ID to set in the message document.
	 * @returns {Promise<void>} A promise that resolves when the threadId field is successfully updated.
	 * @throws Will throw an error if the update operation fails.
	 */
	async updateMessageThreadId(
		messageId: string,
		threadId: string
	): Promise<void> {
		try {
			await updateDoc(
				doc(
					this.firestore,
					this.mainCollection,
					this.docRef,
					'messages',
					messageId
				),
				{
					threadId: threadId,
				}
			);
		} catch (e) {
			console.error('Error updating message document: ', e);
			throw e;
		}
	}

	// code for placeholder of the shared inputfield
	/**
	 * Initializes the  placeholder name based on the provided chat ID for the shared inputfiled.
	 * If the current user is the chat creator, sets the chat receiver to the chat receiver from the chat data.
	 * Otherwise, sets the chat receiver to the chat creator.
	 * Sets the chat placeholder name based on the chat creator's user ID.
	 * Retrieves the display name of the user corresponding to `chatCreator` and assigns it to `placeholderName`.
	 * @param {string} chatId - The ID of the chat to initialize the placeholder for.
	 */
	initializeChatPlaceholder(chatId: string): void {
		const chatData = this.firebaseService.privateChatList.find(
			(chat) => chat.privatChatId === chatId
		);
		if (chatData) {
			if (chatData.chatCreator === this.firebaseService.currentUserId) {
				this.chatCreator = chatData.chatReciver;
			} else {
				this.chatCreator = chatData.chatCreator;
			}
			let placeholderName = this.firebaseService.getUserDisplayName(
				this.chatCreator
			);
			this.placeholderName = placeholderName;
		} else {
			console.warn(
				'Chat not found or chatCreator field does not exist in the chat data!'
			);
		}
	}

	/**
	 * Initializes the channel placeholder name based on the provided channel ID for the shared inputfiled.
	 * Searches for the channel in the `channelList` using the `channelId` and sets the `placeholderName` to the channel's name.
	 * @param {string} channelId - The ID of the channel to initialize the placeholder for.
	 */
	initializeChannelPlaceholder(channelId: string): void {
		const channelData = this.firebaseService.channelList.find(
			(channel) => channel.chanId === channelId
		);
		if (channelData) {
			this.placeholderName = channelData.name;
		} else {
			console.warn(
				'Channel not found or name field does not exist in the channel data!'
			);
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


	// code for reactions might be outsourced later

	setReaction(event: any, messageId: string) {
		console.log('event:', event);
		console.log('messageId:', messageId);
	  
		let nativeEmoji = event.emoji.native;
		console.log('nativeEmoji:', nativeEmoji);
		let reactionId = event.emoji.id;
		let newReaction: Reaction = {
		  reactionId: reactionId,
		  user: this.firebaseService.currentUserId,
		  message_id: messageId,
		  amount: 1,
		  nativeEmoji: nativeEmoji,		
		};
	  
		console.log('newReaction:', newReaction);
	  
		// Check if the reaction already exists
		this.checkIfReactionExists(reactionId, messageId).then(reactionExists => {
		  if (reactionExists) {
			// If it exists, increase the amount
			this.updateReactionAmount(reactionId, messageId, 'increase');
		  } else {
			// If it does not exist, add the new reaction
			this.addReaction(newReaction, messageId);
		  }
		});
	  }
	  // todo needs logic that currentUser can only add one reaction per message
	  async addReaction(newReaction: Reaction, messageId: string): Promise<void> {
		console.log('reaction:', newReaction);
		try {
		  const messageDocRef = doc(
			this.firestore,
			`${this.mainCollection}/${this.docRef}/messages/${messageId}`
		  );
		  await updateDoc(messageDocRef, {
			reactions: arrayUnion(newReaction),
		  });
		  console.log('reaction added', newReaction);
		} catch (error) {
		  console.error('Error updating message text:', error);
		  throw error;
		}
	  }

	  async checkIfReactionExists(reactionId: string, messageId: string): Promise<boolean> {
		try {
		  const messageDocRef = doc(this.firestore, `${this.mainCollection}/${this.docRef}/messages/${messageId}`);
		  const messageDoc = await getDoc(messageDocRef);
	  
		  if (messageDoc.exists()) {
			const data = messageDoc.data();
			if (data && data['reactions']) {
			  return data['reactions'].some((reaction: Reaction) => reaction.reactionId === reactionId);
			}
		  }
		  return false;
		} catch (error) {
		  console.error('Error checking reaction existence:', error);
		  throw error;
		}
	  }

	  async updateReactionAmount(reactionId: string, messageId: string, operation: 'increase' | 'decrease'): Promise<void> {
		try {
		  const messageDocRef = doc(this.firestore, `${this.mainCollection}/${this.docRef}/messages/${messageId}`);
		  const messageDoc = await getDoc(messageDocRef);
	  
		  if (messageDoc.exists()) {
			const data = messageDoc.data();
			if (data && data['reactions']) {
			  const updatedReactions = data['reactions'].map((reaction: Reaction) => {
				if (reaction.reactionId === reactionId) {
				  const updatedAmount = operation === 'increase' ? reaction.amount + 1 : reaction.amount - 1;
				  return {
					...reaction,
					amount: updatedAmount
				  };
				}
				return reaction;
			  }).filter((reaction: Reaction) => reaction.amount > 0);
	  
			  await updateDoc(messageDocRef, { reactions: updatedReactions });
			  console.log(`Reaction amount ${operation === 'increase' ? 'increased' : 'decreased'}`);
			}
		  }
		} catch (error) {
		  console.error(`Error updating reaction amount:`, error);
		  throw error;
		}
	  }

	  async deleteReaction(reactionId: string, messageId: string): Promise<void> {
		try {
		  const messageDocRef = doc(this.firestore, `${this.mainCollection}/${this.docRef}/messages/${messageId}`);
		  const messageDoc = await getDoc(messageDocRef);
	  
		  if (messageDoc.exists()) {
			const data = messageDoc.data();
			if (data && data['reactions']) {
			  const reaction = data['reactions'].find((r: Reaction) => r.reactionId === reactionId);
			  if (reaction) {
				if (reaction.amount > 1) {
				  // If the amount is greater than 1, decrease it by 1
				  await this.updateReactionAmount(reactionId, messageId, 'decrease');
				} else {
				  // If the amount is 1, remove the reaction
				  const updatedReactions = data['reactions'].filter((r: Reaction) => r.reactionId !== reactionId);
				  await updateDoc(messageDocRef, { reactions: updatedReactions });
				  console.log('Reaction deleted');
				}
			  }
			}
		  }
		} catch (error) {
		  console.error('Error deleting reaction:', error);
		  throw error;
		}
	  }
}
