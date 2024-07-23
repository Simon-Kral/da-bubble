import { PrivateMessageListComponent } from './../../post-login/home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { Channel } from './../../models/channel.class';
import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable, of, Subscription } from 'rxjs';
import { DocumentData, Firestore, collection, doc, onSnapshot, orderBy, query, where, } from '@angular/fire/firestore';
import { User } from '../../../app/models/user.class';
import { ChatService } from '../chat/chat.service';
import { Message } from '../../models/message.class';


@Injectable({
	providedIn: 'root',
})
export class SearchService {
	firestore: Firestore = inject(Firestore);
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	router: any;
	//subscriptions 
	userSearchResults: string[] = [];
	channelSearchResults: string[] = [];
	//Private chat messages search
	unsubPrivteMessageList: any;
	privateMessageSearchResults : DocumentData[] = [];
	searchSpesificPrivetMessageResault: DocumentData[] = [];
	//channel messages search
	unsubChannelMessageList: any;
	channelMessageSearchResults: DocumentData[] = [];
	searchSpesificChannelMessageResault: DocumentData[] = [];

	private channelSubscription: Subscription = new Subscription();
	private userSubscription: Subscription = new Subscription();

	//selected items
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
   */
  searchUsersByName(chanId: string): Observable<User[]> {
    const filteredUsers = this.firebaseService.userList.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) &&!user.channels.includes(chanId) 
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
		this.searchUsersByName(channelId).subscribe((users) => {
		});
	}


	/**
	 * Performs a user search based on the provided search text and channel ID.
	 * @param searchText - The search text to be used for user search.
	 * @param channelId - The ID of the channel to filter the user search results (optional).
	 */
	onUserSearch(searchText: string, channelId: string = '') {
		this.searchText = searchText || '';
		this.userSubscription = this.searchUsersByName(channelId).subscribe();
		this.memberSearchActive = this.searchText.trim().length > 0;
	}

  /**
   * Adds a user ID to the `selectedUser` array if it is not already included.
   * If the user ID is added, it logs the updated `selectedUser` array.
   * Also sets `memberSearchActive` to `false` after attempting to add the user ID.
   * @param {string} userId - The ID of the user to add to the `selectedUser` array.
   */
	pushSelectedUserToArray(userId: string) {
		if (!this.selectedUser.includes(userId)) {
			this.selectedUser.push(userId);
		}
		this.memberSearchActive = false;
	}

  /**
   * Removes a user ID from the `selectedUser` array if it exists.
   * Logs the updated `selectedUser` array after the user ID is removed.
   * @param {string} userId - The ID of the user to remove from the `selectedUser` array.
   */
	removeSelectedUserFromArray(userId: string) {
		const index = this.selectedUser.indexOf(userId);
		if (index > -1) {
			this.selectedUser.splice(index, 1);
		}
	}

	/**
   * Searches for users by their email address.
   * Filters the `userList` in `firebaseService` to include users whose email includes the `searchText` and excludes the current user.
   * Updates the `userSearchResults` array with the user IDs of the filtered users.
   * Returns an Observable of the filtered user array.
   * @returns {Observable<User[]>} An Observable emitting the array of filtered users.
   */
	searchUsersByEmail(): Observable<User[]> {
		const filteredUsers = this.firebaseService.userList.filter((user) => 
		  user.email.toLowerCase().includes(this.searchText.toLowerCase()) && 
		  user.userId !== this.firebaseService.currentUserId
		);
		this.userSearchResults = filteredUsers.map((user) => user.userId);
		return of(filteredUsers);
	  }

  /**
   * Handles the email search input.
   * Sets the `searchText` and subscribes to the user search results.
   * Updates the `memberSearchActive` flag based on whether the search text is non-empty.
   * @param {string} searchText - The text input used for searching users by email.
   */
	onEmailSearch(searchText: string) {
		this.searchText = searchText || '';
		this.userSubscription = this.searchUsersByEmail().subscribe();
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
	  
  /**
   * Handles the channel search input.
   * Sets the `searchText`, activates the channel search, and subscribes to the channel search results.
   * @param {string} searchText - The text input used for searching channels by name.
   */
	onChannelSearch(searchText: string) {
		this.channelSearchActive = true;
		this.searchText = searchText.trim();
		this.channelSubscription = this.searchChannelsByName().subscribe();
	}

 /**
   * Handles the focus event for the channel search input.
   * Activates the channel search and subscribes to the channel search results.
   */
	onChannelFocus() {
		this.channelSearchActive = true;
		this.searchChannelsByName().subscribe((channels) => {
		});
	}

	/**
	 * Handles the click event on a channel.
	 * Navigates to the specified channel and performs necessary cleanup.
	 * to-do: do we need that really here?!?!
	 * @param channelId - The ID of the channel to navigate to.
	 */
	handleClickOnChannelAndUnSub(channelId: string) {
        this.router.navigate(['/home/channels', channelId]);
		this.channelSearchActive = false;
		this.channelSearchResults = [];
		this.unSubscribeOnChannelSearch();
    }
	//to-do: do we need that really here?!?!
	handleClickOnUserAndUnSub(userId: string) {
		this.chatService.initializePrivateChat(this.firebaseService.currentUserId, userId);
		this.memberSearchActive = false;
		this.userSearchResults = [];
		this.unSubscribeOnUserSearch();
	}

	/**
	 * Unsubscribes from the channel search subscription if it exists.
	 */
	unSubscribeOnChannelSearch() {
		if (this.channelSubscription) {
			this.channelSubscription.unsubscribe();
		}
	}
	
	/**
	 * Unsubscribes from the user subscription if it exists.
	 */
	unSubscribeOnUserSearch() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	onChatTextSearch(searchText: string) {
		this.searchText = searchText.trim();
		
	}

	/**
	 * Retrieves private chat messages from the Firebase database.
	 * Subscribes to changes in the messages collection for each private chat.
	 * Updates the `privteMessageSearchResults` array with the retrieved messages.
	 */
	getPrivateChatMessages() {
		if(this.unsubPrivteMessageList){
			this.unsubPrivteMessageList();
		}
		this.privateMessageSearchResults  = [];
		this.firebaseService.privateChatList.forEach((chat) => {
			const collectionRef = collection(this.firestore, `privateChats/${chat.privatChatId}/messages`);
			const q = query(collectionRef, orderBy('time'));
			this.unsubPrivteMessageList = onSnapshot(q, (querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					this.privateMessageSearchResults.push(data);
				});
			});
		});
		console.log("All private masseges",this.privateMessageSearchResults);
		
	}	

	/**
	 * Retrieves channel messages from the Firebase database.
	 * Subscribes to changes in the messages collection for the specified channel.
	 * Updates the `channelMessageSearchResults` array with the retrieved messages.
	 */

	getChannelMessages() {
		if(this.unsubChannelMessageList){
			this.unsubChannelMessageList();
		}
		this.channelMessageSearchResults = [];
		this.firebaseService.channelList.forEach((channel) => {
			const collectionRef = collection(this.firestore, `channels/${channel.chanId}/messages`);
			const q = query(collectionRef, orderBy('time'));
			this.unsubChannelMessageList = onSnapshot(q, (querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					this.channelMessageSearchResults.push(data);
					console.log("All channel masseges",this.channelMessageSearchResults);
				});
			});
		});
	}

	searchSesificMessage(searchText: string) {
		let searchTextTrimmed = searchText.toLowerCase().trim();
		this.searchSpesificPrivetMessageResault = [];
		this.searchSpesificChannelMessageResault = [];
		this.privateMessageSearchResults .forEach((message) => {
			if (message['text'].toLowerCase().includes(searchTextTrimmed)) {
				this.searchSpesificPrivetMessageResault.push(message);
			}
		});
		console.log("searchSpesificPrivetMessageResault",this.searchSpesificPrivetMessageResault);
		
		this.channelMessageSearchResults.forEach((message) => {
			if (message['text'].toLowerCase().includes(searchTextTrimmed)) {
				this.searchSpesificChannelMessageResault.push(message);
				console.log("searchSpesificChannelMessageResault",this.searchSpesificChannelMessageResault);
			}
		});
	}



}