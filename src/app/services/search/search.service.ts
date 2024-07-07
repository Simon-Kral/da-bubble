import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  firebaseService = inject(FirebaseService);
  constructor() { }

  userSearchResults = [];
  channelSearchResults = [];
  searchText = new Subject<{ text: string, source: string }>();

  setSearchText(searchObj: { text: string, source: string }) {
    this.searchText.next(searchObj);
  }

  onSearch(searchValue: string, source: string) {
    let searchObj = { text: searchValue, source };
    this.setSearchText(searchObj);
    console.log('Search executed with value:', searchValue, 'from:', source);
  }


}
