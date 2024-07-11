import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable, Subject } from 'rxjs';
import { collection, CollectionReference, DocumentData, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  firestore = inject(FirebaseService).firestore;
  firebaseService = inject(FirebaseService);
  constructor() { }

  userSearchResults = [];
  channelSearchResults = [];
  messageSearchResults = [];


  searchText = '';



  setSearchText(searchValue: string) {
    this.searchText = searchValue;
    console.log('Search executed with value:', searchValue);
  }



}
