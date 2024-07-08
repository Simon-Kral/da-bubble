import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import {
  query,
  orderBy,
  limit,
  where,
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Unsubscribe,
} from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { user } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy, OnInit {
  authService = inject(AuthService);
  firestore: Firestore = inject(Firestore);

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  /**
   * Retrieves the user channels from the Firebase Firestore database.
   */
  getUserChannels() {
    onSnapshot(this.getUserChannelsFilter(), (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
      });
    });
  }

  getChannelsCollection() {
    return collection(this.firestore, 'channels');
  }

  getMessagesCollection() {
    return collection(this.firestore, 'messages');
  }

  getUsersCollection() {
    return collection(this.firestore, 'users');
  }

  /**
   * Retrieves a Firestore query to filter users by their userId.
   *
   * @param userId - The userId to filter by.
   * @returns A Firestore query to filter users by userId.
   */
  getUsersFilter(userId: string) {
    return query(
      this.getUsersCollection(),
      where('userId', '==', userId)
    );
  }

  /**
   * Retrieves a Firestore query to get the channels where the current user is a member.
   * @returns {Query} The Firestore query to get the user's channels.
   */
  getUserChannelsFilter() {
    return query(
      this.getChannelsCollection(),
      where(
        'members',
        'array-contains',
        this.authService.currentUserSig()?.userId
      )
    );
  }

  /**
   * Retrieves a specific user from the database based on the provided user ID.
   * @param userId The ID of the user to retrieve.
   */
  getSpecificUser(userId: string) {
    onSnapshot(this.getUsersFilter(userId), (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);

      });
    });

  }

  /**
   * Retrieves a Firestore query for private messages filtered by the current user.
   * @returns {Query} The Firestore query for private messages.
   */
  getPrivateMessagesFilter() {
    return query(
      this.getMessagesCollection(),
      where('chatCreator', '==', this.authService.currentUserSig()?.userId)
    );
  }

  /**
   * Retrieves private messages from the database.
   */
  getPrivetMessages() {
    onSnapshot(this.getPrivateMessagesFilter(), (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
      });
    });
  }
}
