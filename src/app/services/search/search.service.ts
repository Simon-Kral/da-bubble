import { Channel } from './../../models/channel.class';
import { ChatService } from './../chat/chat.service';
import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { map, Observable, of, Subject } from 'rxjs';
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
	arrayUnion,
	collectionData,
} from '@angular/fire/firestore';
import { User } from '../../../app/models/user.class';


@Injectable({
	providedIn: 'root',
})
export class SearchService {
	firestore: Firestore = inject(Firestore);
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	constructor() {}

	userSearchResults: string[] = [];
	channelSearchResults: string[] = [];
	messageSearchResults = [];

	selectedUser: string[] = [];
	selectedChannel: string = '';
	selectedMessage = [];

	searchText = '';
	memberSearchActive: boolean = false;
	channelSearchActive: boolean = false;



	// code for user search

  /**
   * Searches the users list for documents where the name field matches or contains the search text.
   * @returns An Observable of the search results.
   *  to-do why channelId ?????????
   */
  searchUsersByName(channelId: string): Observable<User[]> {
    const filteredUsers = this.firebaseService.userList.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) &&!user.channels.includes(channelId) 
	  	&&user.userId !== this.firebaseService.currentUserId &&!this.selectedUser.includes(user.userId)
		
		
    );
    this.userSearchResults = filteredUsers.map((user) => user.userId);
    return of(filteredUsers);
  }

  // to-do why channelId ?????????
  onFocus(searchText: string, channelId: string = '') {
	this.memberSearchActive = true;
	this.searchText = searchText || '';
	console.log('Search text received by searchService:', this.searchText);

	this.searchUsersByName(channelId).subscribe((users) => {
		console.log('Search results:', users);
		console.log(
			'userSearchResults array contains:',
			this.userSearchResults
		);
	});
}

// to-do why channelId ?????????
onSearch(searchText: string, channelId: string = '') {
	this.searchText = searchText || '';
	console.log('Search text received by searchService:', this.searchText);

	this.searchUsersByName(channelId).subscribe((users) => {
		console.log('Search results:', users);
		console.log(
			'userSearchResults array contains:',
			this.userSearchResults
		);
		
	});
	this.memberSearchActive = this.searchText.trim().length > 0;
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

// code for channel search 


    /**
   * Searches the channel list for documents where the name field matches or contains the search text.
   * @returns An Observable of the search results.
   */
	searchChannelsByName(): Observable<Channel[]> {
		const filteredChannels = this.firebaseService.channelList.filter(
			(channel) =>
				channel.name.toLowerCase().includes(this.searchText.toLowerCase()) 
				&& channel.chanId !== this.selectedChannel
			  
		  );
		  this.channelSearchResults = filteredChannels.map((channel) => channel.chanId);
		  return of(filteredChannels);
		}
	  



		onChannelSearch(searchText: string) {
			this.channelSearchActive = true;
			this.searchText = searchText.trim();
			console.log('Search text received by searchService:', this.searchText);
		  
			this.searchChannelsByName().subscribe((channels) => {
			  console.log('Search results:', channels);
			  console.log('channelSearchResults array contains:', this.channelSearchResults);
			});
		  }


		  onChannelFocus() {
			this.channelSearchActive = true;
			  this.searchChannelsByName().subscribe((channels) => {
				console.log('All channels:', channels);
				console.log('channelSearchResults array contains:', this.channelSearchResults);
			  });
			} 
	}


