import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { map, Observable, Subject } from 'rxjs';
import { query,orderBy,where,Firestore,collection,doc,onSnapshot,updateDoc,getDocs, arrayUnion, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);
  constructor() { }

  userSearchResults: string[] = [];
  channelSearchResults = [];
  messageSearchResults = [];

  selectedUser: string [] = [];
  selectedChannel = [];
  selectedMessage = [];


  searchText = '';
  memberSearchActive: boolean = false;




  /**
   * Searches the users collection for documents where the name field matches or contains the search text.
   * @param searchText The text to search for in user names.
   * @returns An Observable of the search results.
   */
  searchUsersByName(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection, where('name', '>=', this.searchText), where('name', '<=', this.searchText + '\uf8ff'));
    return collectionData(usersQuery, { idField: 'id' }).pipe(
      map(users => {
        this.userSearchResults = [];
        users.forEach(user => {
          this.userSearchResults.push(user.id);
        });
        return users;
      })
    );
  }


  pushSelectedUserToArray(userId: string) {
    if (!this.selectedUser.includes(userId)) {
      this.selectedUser.push(userId);
      console.log('User pushed into Array', this.selectedUser);
    }
    this.memberSearchActive = false;
  }

  removeSelectedUserFromArray(userId: string) {
    const index = this.selectedUser.indexOf(userId);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
    }
    console.log('User removed from Array', this.selectedUser);
  }
  
}

