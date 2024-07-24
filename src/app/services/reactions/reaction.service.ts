import { inject, Injectable } from '@angular/core';
import { Reaction } from '../../models/reaction.class';
import { Firestore,	doc, updateDoc, getDoc, arrayUnion, DocumentReference } from '@angular/fire/firestore';
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

	currentMessageId: string = '';  // getting used to store the current message id of chat or thread
	currentThreadId: string = '';	// getting used to store the current thread id of chat

  	setReactionThumbUp: Reaction = {
	reactionId: '1F44D',
	user: [this.firebaseService.currentUserId],
	message_id: this.currentMessageId,
	amount: 1,
	nativeEmoji: '👍',
  };
  setReactionThumbDown: Reaction = {
	reactionId: '1F44E',
	user: [this.firebaseService.currentUserId],
	message_id: this.currentMessageId,
	amount: 1,
	nativeEmoji: '👎',
  };

/**
 * Adds a new reaction to a message.
 *
 * @param {Reaction} newReaction - The new reaction object to be added.
 * @param {string} messageId - The ID of the message to which the reaction is to be added.
 * @returns {Promise<void>} A promise that resolves when the reaction is successfully added.
 * @throws Will throw an error if there is an issue updating the Firestore document.
 */
async addSpecificReaction(messageId: string, reaction: Reaction, source: string): Promise<void> {
    console.log('reaction:', reaction);
    try {
      const messageDocRef = this.getDocRef(source, messageId);
      const messageDoc = await getDoc(messageDocRef);

      if (messageDoc.exists()) {
        const data = messageDoc.data();
        if (data && data['reactions']) {
          const existingReaction = data['reactions'].find((r: Reaction) => r.reactionId === reaction.reactionId);

          if (existingReaction) {
            if (!existingReaction.user.includes(this.firebaseService.currentUserId)) {
              await this.updateReactionAmount(reaction.reactionId, messageId, 'increase', source);
            } else {
              console.log('User has already reacted with this reaction');
            }
          } else {
            await updateDoc(messageDocRef, {
              reactions: arrayUnion(reaction),
            });
            console.log('reaction added', reaction);
          }
        } else {
          await updateDoc(messageDocRef, {
            reactions: [reaction],
          });
          console.log('reaction added', reaction);
        }
      } else {
        throw new Error('Message document does not exist.');
      }
    } catch (error) {
      console.error('Error updating message text:', error);
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
async deleteReaction(reactionId: string, messageId: string, source: string): Promise<void> {
    try {
      const messageDocRef = this.getDocRef(source, messageId);
      const messageDoc = await getDoc(messageDocRef);

      if (messageDoc.exists()) {
        const data = messageDoc.data();
        if (data && data['reactions']) {
          const reaction = data['reactions'].find((r: Reaction) => r.reactionId === reactionId && r.user.includes(this.firebaseService.currentUserId));
          if (reaction) {
            if (reaction.user.length > 1) {
              const updatedUsers = reaction.user.filter((userId: string) => userId !== this.firebaseService.currentUserId);
              const updatedReactions = data['reactions'].map((r: Reaction) => {
                if (r.reactionId === reactionId) {
                  return {
                    ...r,
                    user: updatedUsers,
                    amount: r.amount - 1
                  };
                }
                return r;
              });
              await updateDoc(messageDocRef, { reactions: updatedReactions });
              console.log('User removed from reaction');
            } else {
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


/**
 * Handles the reaction event, either adding a new reaction or updating the amount of an existing reaction.
 *
 * @param {any} event - The event object from the emoji picker.
 * @param {string} messageId - The ID of the message to which the reaction is to be added or updated.
 */
handleReaction(event: any, messageId: string, source: string) {
    console.log('event:', event);          
    console.log('messageId:', messageId);
    let nativeEmoji = event.emoji.native;
    console.log('nativeEmoji:', nativeEmoji);
    let reactionId = event.emoji.unified;

    let newReaction: Reaction = {
      reactionId: reactionId,
      user: [this.firebaseService.currentUserId],
      message_id: messageId,
      amount: 1,
      nativeEmoji: nativeEmoji,
    };

    console.log('newReaction:', newReaction);

    this.addSpecificReaction(messageId, newReaction, source);

    this.showEmojiPicker = false;
  }


/**
 * Updates the amount of a specific reaction for a message.
 * @param {string} reactionId - The ID of the reaction to update.
 * @param {string} messageId - The ID of the message containing the reaction.
 * @param {'increase' | 'decrease'} operation - The operation to perform on the reaction amount: 'increase' or 'decrease'.
 * @returns {Promise<void>} A promise that resolves when the reaction amount is updated.
 * @throws Will throw an error if there is an issue accessing or updating the Firestore document.
 */
async updateReactionAmount(reactionId: string, messageId: string, operation: 'increase' | 'decrease', source: string): Promise<void> {
    try {
      const messageDocRef = this.getDocRef(source, messageId);
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



  private getDocRef(source: string, messageId: string): DocumentReference {
    if (source === 'chat') {
      return doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
    } else if (source === 'thread') {
      return doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${this.currentThreadId}/messageAnswers/${messageId}`);
    } else {
      throw new Error('Invalid source');
    }
  }


}
