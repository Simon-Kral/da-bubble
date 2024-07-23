import { inject, Injectable } from '@angular/core';
import { Reaction } from '../../models/reaction.class';
import { Firestore,	doc, updateDoc, getDoc, arrayUnion } from '@angular/fire/firestore';
import { ChatService } from '../chat/chat.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  firestore: Firestore = inject(Firestore);
  chatService: ChatService = inject(ChatService);
  firebaseService: FirebaseService = inject(FirebaseService);

  showEmojiPicker: boolean = false;
  emojiPickerIndex: number = 0;

  constructor() { }



/**
 * Handles the reaction event, either adding a new reaction or updating the amount of an existing reaction.
 *
 * @param {any} event - The event object from the emoji picker.
 * @param {string} messageId - The ID of the message to which the reaction is to be added or updated.
 */
handleReaction(event: any, messageId: string) {
	console.log('event:', event);
	console.log('messageId:', messageId);
  
	let nativeEmoji = event.emoji.native;
	console.log('nativeEmoji:', nativeEmoji);
	let reactionId = event.emoji.id;
	let newReaction: Reaction = {
	  reactionId: reactionId,
	  user: [this.firebaseService.currentUserId],
	  message_id: messageId,
	  amount: 1,
	  nativeEmoji: nativeEmoji,
	};
  
	console.log('newReaction:', newReaction);
  
	// Check if the reaction already exists and if the current user already reacted
	this.checkIfReactionExistsForUser(reactionId, messageId).then(reactionExists => {
	  if (reactionExists) {
		// If it exists, increase the amount
		this.updateReactionAmount(reactionId, messageId, 'increase');
	  } else {
		// If it does not exist, add the new reaction
		this.addReaction(newReaction, messageId);
	  }
	});
	this.showEmojiPicker = false;
  }

/**
 * Adds a new reaction to a message.
 *
 * @param {Reaction} newReaction - The new reaction object to be added.
 * @param {string} messageId - The ID of the message to which the reaction is to be added.
 * @returns {Promise<void>} A promise that resolves when the reaction is successfully added.
 * @throws Will throw an error if there is an issue updating the Firestore document.
 */
async addReaction(newReaction: Reaction, messageId: string): Promise<void> {
	console.log('reaction:', newReaction);
	try {
	  const messageDocRef = doc(
		this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`
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

/**
 * Checks if the current user has already added a reaction with the specified ID to the given message.
 * 
 * @param {string} reactionId - The ID of the reaction to check for.
 * @param {string} messageId - The ID of the message to check the reaction in.
 * @returns {Promise<boolean>} A promise that resolves to true if the user has already added the reaction, false otherwise.
 * @throws Will throw an error if there is an issue accessing the Firestore document.
 */
async checkIfReactionExistsForUser(reactionId: string, messageId: string): Promise<boolean> {
	try {
	  const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
	  const messageDoc = await getDoc(messageDocRef);
  
	  if (messageDoc.exists()) {
		const data = messageDoc.data();
		if (data && data['reactions']) {
		  return data['reactions'].some((reaction: Reaction) => reaction.reactionId === reactionId && reaction.user.includes(this.firebaseService.currentUserId));
		}
	  }
	  return false;
	} catch (error) {
	  console.error('Error checking reaction existence for user:', error);
	  throw error;
	}
  }


/**
 * Updates the amount of a specific reaction for a message.
 * @param {string} reactionId - The ID of the reaction to update.
 * @param {string} messageId - The ID of the message containing the reaction.
 * @param {'increase' | 'decrease'} operation - The operation to perform on the reaction amount: 'increase' or 'decrease'.
 * @returns {Promise<void>} A promise that resolves when the reaction amount is updated.
 * @throws Will throw an error if there is an issue accessing or updating the Firestore document.
 */
async updateReactionAmount(reactionId: string, messageId: string, operation: 'increase' | 'decrease'): Promise<void> {
	try {
	  const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
	  const messageDoc = await getDoc(messageDocRef);
  
	  if (messageDoc.exists()) {
		const data = messageDoc.data();
		if (data && data['reactions']) {
		  const updatedReactions = data['reactions'].map((reaction: Reaction) => {
			if (reaction.reactionId === reactionId) {
			  const updatedAmount = operation === 'increase' ? reaction.amount + 1 : reaction.amount - 1;
			  if (operation === 'increase' && !reaction.user.includes(this.firebaseService.currentUserId)) {
				reaction.user.push(this.firebaseService.currentUserId);
			  }
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

/**
 * Deletes a currentUser reaction from a message document which got added before by the current user.
 * 
 * @param {string} reactionId - The ID of the reaction to be deleted.
 * @param {string} messageId - The ID of the message document containing the reaction.
 * @returns {Promise<void>} A promise that resolves when the reaction is deleted or updated.
 * @throws Will throw an error if there is an issue accessing or updating the Firestore document.
 */
async deleteReaction(reactionId: string, messageId: string): Promise<void> {
  try {
    const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
    const messageDoc = await getDoc(messageDocRef);

    if (messageDoc.exists()) {
      const data = messageDoc.data();
      if (data && data['reactions']) {
        const reaction = data['reactions'].find((r: Reaction) => r.reactionId === reactionId && r.user.includes(this.firebaseService.currentUserId));
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
        } else {
          console.log('No reaction found for the current user');
        }
      }
    }
  } catch (error) {
    console.error('Error deleting reaction:', error);
    throw error;
  }
}
}
