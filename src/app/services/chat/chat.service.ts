import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { PrivateMessageComponent } from '../../post-login/private-message/private-message.component';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  firebaseService = inject(FirebaseService);

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



  
}
