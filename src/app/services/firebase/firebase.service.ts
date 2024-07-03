import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, Unsubscribe } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { user } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy, OnInit	{

  authService = inject(AuthService);
  firestore: Firestore = inject(Firestore);


  constructor() {

  }

  ngOnInit(): void {

  }

getUserChannels() {
  onSnapshot(this.getUserChannelsFilter(), (snapshot) => {
    snapshot.docChanges().forEach((doc) => {

    });
  });
}

  getChannelsCollection() {
    return collection(this.firestore, 'channels');
  }

  getUserChannelsFilter() {
    return query(this.getChannelsCollection(), where('members', 'array-contains', this.authService.currentUserSig()?.userId));
  }


  ngOnDestroy(): void {

  }

}
