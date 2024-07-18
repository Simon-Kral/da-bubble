import { ChatService } from './../chat/chat.service';
import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { map, Observable, Subject } from 'rxjs';
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
	 * Searches the users collection for documents where the name field matches or contains the search text.
	 * @param searchText The text to search for in user names.
	 * @returns An Observable of the search results.
	 */
	searchUsersByName(): Observable<any[]> {
		const usersCollection = collection(this.firestore, 'users');
		const usersQuery = query(
			usersCollection,
			where('name', '>=', this.searchText),
			where('name', '<=', this.searchText + '\uf8ff')
		);

		return collectionData(usersQuery, { idField: 'id' }).pipe(
			map((users) => {
				this.userSearchResults = [];
				const filteredUsers = users.filter(
					(user) =>
						user.id !== this.firebaseService.currentUserId &&
						!this.selectedUser.includes(user.id)
				);
				filteredUsers.forEach((user) => {
					this.userSearchResults.push(user.id);
				});

				return filteredUsers;
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
}
