import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

//prvt msg component
showPrivateNote: boolean = false;

// moved from chat.service -- varaibels for currentUser & userProfile visibility

isCurrentUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
isCurrentUserProfileVisible$ = this.isCurrentUserProfileVisibleSource.asObservable();  
isUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
isUserProfileVisible$ = this.isUserProfileVisibleSource.asObservable();


  constructor() { }


  //prvt msg component
  togglePrivateNote(trueOrFalse: boolean) {
    if (trueOrFalse) {
      this.showPrivateNote = true;
    } else {
      this.showPrivateNote = false
  }
}


toggleCurrentUserProfileVisibility(visible: boolean) {
  this.isCurrentUserProfileVisibleSource.next(visible);
}
toggleUserProfileVisibility(visible: boolean) {
  this.isUserProfileVisibleSource.next(visible);
}

}
