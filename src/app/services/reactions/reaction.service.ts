import { inject, Injectable } from '@angular/core';
import { Reaction } from '../../models/reaction.class';
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
import { ChatService } from '../chat/chat.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  firestore: Firestore = inject(Firestore);
  chatService: ChatService = inject(ChatService);
  firebaseService: FirebaseService = inject(FirebaseService);


  constructor() { }



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
			`${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`
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
		  const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
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
		  const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
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
		  const messageDocRef = doc(this.firestore, `${this.chatService.mainCollection}/${this.chatService.docRef}/messages/${messageId}`);
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
