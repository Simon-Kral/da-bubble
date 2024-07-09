import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { PrivateMessageComponent } from '../../post-login/private-message/private-message.component';
import { BehaviorSubject } from 'rxjs';
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


// to-do awaiting team feedback this code might be outsource into an seperate service since its not possible to communicate between child to parent when child is embedded due to the router-outlet

isCurrentUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
isCurrentUserProfileVisible$ = this.isCurrentUserProfileVisibleSource.asObservable();  
isUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
isUserProfileVisible$ = this.isUserProfileVisibleSource.asObservable();
isChannelDetailsVisibleSource = new BehaviorSubject<boolean>(false);
isChannelDetailsVisible$ = this.isChannelDetailsVisibleSource.asObservable();

toggleChannelDetailsVisibility(visible: boolean) {
	  this.isChannelDetailsVisibleSource.next(visible);
}

toggleCurrentUserProfileVisibility(visible: boolean) {
  this.isCurrentUserProfileVisibleSource.next(visible);
}
toggleUserProfileVisibility(visible: boolean) {
  this.isUserProfileVisibleSource.next(visible);
}
}
