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
	selectedChannel: string[] = [];
	selectedMessage = [];

	searchText = '';
	memberSearchActive: boolean = false;

	// to-do what do we need that for?
	savedUserForChannel: string[] = [];
	filteredUsers: User[] = [];

  /**
   * Searches the users list for documents where the name field matches or contains the search text.
   * @returns An Observable of the search results.
   */
  searchUsersByName(): Observable<User[]> {
    const filteredUsers = this.firebaseService.userList.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        user.userId !== this.firebaseService.currentUserId &&
        !this.selectedUser.includes(user.userId)
    );
    this.userSearchResults = filteredUsers.map((user) => user.userId);
    return of(filteredUsers);
  }


	onFocus(searchText: string) {
		this.memberSearchActive = true;
		this.searchText = searchText || '';
		console.log('Search text received by searchService:', this.searchText);

		this.searchUsersByName().subscribe((users) => {
			console.log('Search results:', users);
			console.log(
				'userSearchResults array contains:',
				this.userSearchResults
			);
		});
	}

	onSearch(searchText: string) {
		this.searchText = searchText || '';
		console.log('Search text received by searchService:', this.searchText);

		this.searchUsersByName().subscribe((users) => {
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

	/**
	 * Combines the members from the current channel and the saved users for the channel.
	 * Removes any duplicate IDs and returns an array of strings.
	 * to-do outsource to search service
	 * @returns {string[]} An array of unique member IDs.
	 */
	combineMembers() {
		const currentChannel = this.firebaseService.channelList.find(
			(channel) => channel.chanId === this.chatService.docRef
		);
		const currentMembers = currentChannel ? currentChannel.members : [];
		const uniqueMembers = Array.from(
			new Set([...currentMembers, ...this.selectedUser])
		);
		return uniqueMembers;
	}

	/**
	 * Deletes a user from the savedUserForChannel array.
	 * @param userId - The ID of the user to be deleted.
	 * to-do outsource to search service
	 */
	deleteUserFromSavedUserForChannel(userId: string) {
		this.savedUserForChannel = this.savedUserForChannel.filter(
			(user) => user !== userId
		);
	}

	/**
	 * Adds a user to the list of saved users for channels.
	 * If the user is already in the list, it does nothing.
	 * @param userId - The ID of the user to add.
	 * to-do outsource to search service
	 */
	addUserToChannelslist(userId: string) {
		const checkId = this.savedUserForChannel.includes(userId);
		if (checkId) {
			return;
		}
		this.savedUserForChannel.push(userId);
		console.log('Saved User:', this.savedUserForChannel);
	}
}