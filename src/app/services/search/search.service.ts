import { Channel } from './../../models/channel.class';
import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable, of, Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../../app/models/user.class';
import { ChatService } from '../chat/chat.service';


@Injectable({
	providedIn: 'root',
})
export class SearchService {
	firestore: Firestore = inject(Firestore);
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	router: any;
	
	userSearchResults: string[] = [];
	channelSearchResults: string[] = [];
	messageSearchResults = [];
	private channelSubscription: Subscription = new Subscription();
	private userSubscription: Subscription = new Subscription();
	selectedUser: string[] = [];
	selectedChannel: string = '';
	selectedMessage = [];
	
	searchText = '';
	memberSearchActive: boolean = false;
	channelSearchActive: boolean = false;
	
	constructor() {}




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


	/**
	 * Handles the user focus event and performs a search for users by name.
	 * @param searchText - The search text entered by the user.
	 * @param channelId - The ID of the channel to search within (optional).
	 */
	onUserFocus(searchText: string, channelId: string = '') {
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


	/**
	 * Performs a user search based on the provided search text and channel ID.
	 * @param searchText - The search text to be used for user search.
	 * @param channelId - The ID of the channel to filter the user search results (optional).
	 */
	onUserSearch(searchText: string, channelId: string = '') {
		this.searchText = searchText || '';
		console.log('Search text received by searchService:', this.searchText);

		this.userSubscription = this.searchUsersByName(channelId).subscribe();
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


	searchUsersByEmail(): Observable<User[]> {
		const filteredUsers = this.firebaseService.userList.filter((user) => 
		  user.email.toLowerCase().includes(this.searchText.toLowerCase()) && 
		  user.userId !== this.firebaseService.currentUserId
		);
		this.userSearchResults = filteredUsers.map((user) => user.userId);
		return of(filteredUsers);
	  }

	onEmailSearch(searchText: string) {
		this.searchText = searchText || '';
		console.log('Search text received by searchService:', this.searchText);
		this.userSubscription = this.searchUsersByEmail().subscribe();
		console.log('User search results:', this.userSearchResults);
		this.memberSearchActive = this.searchText.trim().length > 0;
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
		this.channelSubscription = this.searchChannelsByName().subscribe();
	}


	onChannelFocus() {
		this.channelSearchActive = true;
		this.searchChannelsByName().subscribe((channels) => {
		console.log('All channels:', channels);
		console.log('channelSearchResults array contains:', this.channelSearchResults);
		});
	}

	/**
	 * Handles the click event on a channel.
	 * Navigates to the specified channel and performs necessary cleanup.
	 * 
	 * @param channelId - The ID of the channel to navigate to.
	 */
	handleClickOnChannelAndUnSub(channelId: string) {
        this.router.navigate(['/home/channels', channelId]);
		this.channelSearchActive = false;
		this.channelSearchResults = [];
		this.unSubscribeOnChannelSearch();
    }

	handleClickOnUserAndUnSub(userId: string) {
		this.chatService.startNewPrivateChat(this.firebaseService.currentUserId, userId);
		this.memberSearchActive = false;
		this.userSearchResults = [];
		this.unSubscribeOnUserSearch();
	}

	/**
	 * Unsubscribes from the channel search subscription if it exists.
	 */
	unSubscribeOnChannelSearch() {
		console.log('Unsubscribing from channel search subscription', this.channelSubscription);
		if (this.channelSubscription) {
			this.channelSubscription.unsubscribe();
			console.log('Channel search subscription unsubscribed', this.channelSubscription);
			
		}
	}
	
	/**
	 * Unsubscribes from the user subscription if it exists.
	 */
	unSubscribeOnUserSearch() {
		console.log('Unsubscribing from user search subscription', this.userSubscription);
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
			console.log('User search subscription unsubscribed', this.userSubscription);
			
		}
	}

}


