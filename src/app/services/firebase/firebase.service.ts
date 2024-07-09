import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
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
} from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { Channel } from '../../models/channel.class';
import { User } from '../../models/user.class';
import { PrivateChat } from '../../models/privateChat.class';
@Injectable({
	providedIn: 'root',
})
export class FirebaseService implements OnDestroy, OnInit {
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);

	currentUserId: any;
	currentUser: User = new User();

	channelList: Channel[] = [];
	userList: User[] = [];
	privateChatList: PrivateChat[] = [];

	unsubscribeChannelList: any;
	unsubscribeUserList: any;
	unsubscribePrivateChatList: any;

	// variables for private message component
	selectedPrivateChatId: string = '';
	selectedPrivateChatCreatorId: string = '';

	constructor() {
		this.getCurrentUserId();
		this.ngOnInit();
		console.log('Current User ID:', this.currentUserId);   // to-do remove after developement is finished
	}

	ngOnInit(): void {
		this.subChannelsList();
		this.subUsersList();
		this.subPrivateChatList();
	}

	ngOnDestroy(): void {
		if (this.unsubscribeChannelList) {
			this.unsubscribeChannelList();
		}
		if (this.unsubscribeUserList) {
			this.unsubscribeUserList();
		}
		if (this.unsubscribePrivateChatList) {
			this.unsubscribePrivateChatList();
		}
	}

	// current user code
	/**
	 * Retrieves the current user ID from the session storage and sets it to the currentUserId variable.
	 */
	getCurrentUserId() {
		this.currentUserId = sessionStorage.getItem('currentUserId');
	}
	/**
	 * Fetches the current user data as an object from the Firestore database.
	 * The user ID is used to query the 'users' collection in Firestore.
	 * // to-do remove after developement is finished
	 * @returns {Promise<User>} A promise that resolves to a User object containing user data.
	 */
	async getCurrentUserAsObject() {
		const userQuery = query(
			collection(this.firestore, 'users'),
			where('userId', '==', this.currentUserId)
		);
		const userSnapshot = await getDocs(userQuery);

		const currentUserDoc = userSnapshot.docs[0];
		const currentUserData = currentUserDoc.data();

		return {
			userId: currentUserData['userId'],
			name: currentUserData['name'],
			status: currentUserData['status'],
			photoURL: currentUserData['photoURL'],
			channels: currentUserData['channels'],
			email: currentUserData['email'],
			privateNoteRef: currentUserData['privateNoteRef'],
		} as User;
	}
	/**
	 * Sets the current user property by fetching the user data as an object from Firestore.
	 * Logs the current user object to the console.
	 */ // to-do remove after developement is finished
	async setCurrentUserAsObjekt() {
		this.currentUser = await this.getCurrentUserAsObject();
		console.log('Current User Object', this.currentUser);
	}

	/**
	 * Clears the current user property by setting it to a new instance of User.
	 * Logs that the current user has been cleared.
	 */ // to-do remove after developement is finished
	clearCurrentUser() {
		this.currentUser = new User();
		console.log('Current User has been cleared');
	}

	// channel code
	/**
	 * Subscribes to the channels collection in Firestore and updates the channel list in real-time.
	 * Orders the channels by name.
	 * Logs the updated channel list to the console.
	 * to-do remove filter, all channels should be displayed
	 */
	subChannelsList() {
		const q = query(this.getChannelsRef(), orderBy('name'));
		this.unsubscribeChannelList = onSnapshot(
			q,
			(snapshot) => {
				this.channelList = [];
				snapshot.forEach((doc) => {
					const channel = this.setChannel(doc.data(), doc.id);
					if (this.isCurrentUserInChannel(channel)) {
						this.channelList.push(channel);
					}
				});
				console.log('Channel List:', this.channelList);
			},
			(error) => {
				console.error('Error fetching channels: ', error);
			}
		);
	}

	/**
	 * Checks if the current user is a member of the channel.
	 * @param {Channel} channel - The channel object to check.
	 * @returns {boolean} True if the current user is a member of the channel, otherwise false.
	 */
	isCurrentUserInChannel(channel: Channel): boolean {
		return channel.members.includes(this.currentUserId);
	}

	/**
	 * Returns a reference to the channels collection in Firestore.
	 *
	 * @returns {CollectionReference} A reference to the channels collection.
	 */
	getChannelsRef() {
		return collection(this.firestore, 'channels');
	}

	/**
	 * Creates a Channel object from Firestore document data.
	 *
	 * @param {any} obj - The Firestore document data.
	 * @param {string} id - The ID of the Firestore document.
	 * @returns {Channel} A Channel object containing the data from the Firestore document.
	 */
	setChannel(obj: any, id: string): Channel {
		return {
			chanId: id || '',
			name: obj.name || '',
			description: obj.description || '',
			members: obj.members || [],
			messages: obj.messages || [],
			createdAt: obj.createdAt || '',
			createdBy: obj.createdBy || '',
		};
	}

	/**
	 * Checks if a channel with the specified name already exists in the 'channels' collection.
	 *
	 * @param {string} channelName - The name of the channel to check for existence.
	 * @returns {Promise<boolean>} - A promise that resolves to true if a channel with the specified name exists, otherwise false.
	 */
	async checkChannelNameExists(channelName: string): Promise<boolean> {
		const channelsRef = collection(this.firestore, 'channels');
		const q = query(channelsRef, where('name', '==', channelName));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	}

	// user code
	/**
	 * Subscribes to the users collection in Firestore and updates the user list in real-time.
	 * Orders the users by name.
	 * Logs the updated user list to the console.
	 */
	subUsersList() {
		const q = query(this.getUsersRef(), orderBy('name'));
		this.unsubscribeUserList = onSnapshot(
			q,
			(snapshot) => {
				this.userList = [];
				snapshot.forEach((doc) => {
					this.userList.push(this.setUser(doc.data(), doc.id));
				});
				console.log('User List:', this.userList);
			},
			(error) => {
				console.error('Error fetching Users: ', error);
			}
		);
	}

	/**
	 * Returns a reference to the users collection in Firestore.
	 * @returns {CollectionReference} A reference to the users collection.
	 */
	getUsersRef() {
		return collection(this.firestore, 'users');
	}

	/**
	 * Creates a User object from Firestore document data.
	 *
	 * @param {any} obj - The Firestore document data.
	 * @param {string} id - The ID of the Firestore document.
	 * @returns {User} A User object containing the data from the Firestore document.
	 */
	setUser(obj: any, id: string): User {
		return {
			userId: id || '',
			name: obj.name || '',
			status: obj.status || '',
			photoURL: obj.photoURL || '',
			channels: obj.channels || [],
			email: obj.email || '',
			privateNoteRef: obj.privateNoteRef || '',
		};
	}

	/**
	 * Retrieves the display name of a user based on the provided user ID.
	 * If the user is found in the userList, returns the user's name; otherwise, returns 'Unknown'.
	 *
	 * @param {string} userId - The ID of the user to retrieve the display name for.
	 * @returns {string} The display name of the user or 'Unknown' if the user is not found.
	 */
	getUserDisplayName(userId: string): string {
		const user = this.getUserById(userId);
		return user ? user.name : 'Unknown';
	}

	/**
	 * Retrieves the avatar URL of a user based on the provided user ID.
	 * If the user is found in the userList, returns the user's photo URL; otherwise, returns an empty string.
	 *
	 * @param {string} userId - The ID of the user to retrieve the avatar URL for.
	 * @returns {string} The avatar URL of the user or an empty string if the user is not found.
	 */
	getUserAvatar(userId: string): string {
		const user = this.getUserById(userId);
		return user ? user.photoURL : '';
	}

	/**
	 * Retrieves the CSS class representing the status (online/offline) of a user based on the provided user ID.
	 * If the user is found in the userList, returns 'online' if the user's status is true, otherwise 'offline'.
	 * If the user is not found, returns an empty string.
	 *
	 * @param {string} userId - The ID of the user to retrieve the status class for.
	 * @returns {string} The CSS class representing the status of the user ('online' or 'offline') or an empty string if the user is not found.
	 */
	getUserStatusClass(userId: string): string {
		const user = this.getUserById(userId);
		return user ? (user.status ? 'online' : 'offline') : '';
	}

	/**
	 * Checks if a user is online based on the provided user ID.
	 * If the user is found in the userList, returns true if the user's status is true (online); otherwise, returns false (offline).
	 * If the user is not found, returns false.
	 *
	 * @param {string} userId - The ID of the user to check the online status for.
	 * @returns {boolean} True if the user is online, false otherwise.
	 */
	getUserOnlineStatus(userId: string): boolean {
		const user = this.getUserById(userId);
		return user ? user.status : false;
	}

	/**
	 * Retrieves a user object from the userList based on the provided user ID.
	 *
	 * @param {string} userId - The ID of the user to retrieve from the userList.
	 * @returns {User | undefined} The user object if found, otherwise undefined.
	 */
	getUserById(userId: string): User | undefined {
		return this.userList.find((user) => user.userId === userId);
	}

	/**
	 * Retrieves the email-adress of a user based on the provided user ID.
	 * If the user is found in the userList, returns the user's email; otherwise, returns an empty string.
	 *
	 * @param {string} userId - The ID of the user to retrieve the email for.
	 * @returns {string} The email of the user or an empty string if the user is not found.
	 */
	getUserEmail(userId: string): string {
		const user = this.getUserById(userId);
		return user ? user.email : '';
	}

	/**
	 * Returns the status text based on the user's online status.
	 * If the user is found in the userList, returns 'Aktiv' if the user's status is true (online); otherwise, returns 'Abwesend'.
	 * If the user is not found, returns an empty string.
	 *
	 * @param {string} userId - The ID of the user to check the status for.
	 * @returns {string} 'Aktiv' if the user is online, 'Abwesend' otherwise.
	 */
	getUserStatusText(userId: string): string {
		return this.getUserOnlineStatus(userId) ? 'Aktiv' : 'Abwesend';
	}

	/**
	 * Updates the user profile in the Firestore database.
	 * @param updates - An object containing the fields to update.
	 * @returns A promise that resolves when the user profile is successfully updated.
	 */
	updateUserProfile(updates: Partial<any>): Promise<void> {
		const userDocRef = doc(
			this.firestore,
			`users/${this.currentUser.userId}`
		);
		return updateDoc(userDocRef, updates);
	}

	/**
	 * Updates the user avatar in the Firestore database.
	 * @param {string} newAvatarPath - The new avatar path to update.
	 * @returns {Promise<void>} A promise that resolves when the user avatar is successfully updated.
	 */
	updateUserAvatar(newAvatarPath: string): Promise<void> {
		const userDocRef = doc(
			this.firestore,
			`users/${this.currentUser.userId}`
		);
		return updateDoc(userDocRef, { photoURL: newAvatarPath });
	}
	/**
	 * Updates the user status in the Firestore database.
	 * @param {boolean} newStatus - The new status to update.
	 * @returns {Promise<void>} A promise that resolves when the user status is successfully updated.
	 */
	updateUserStatus(newStatus: boolean): Promise<void> {
		const userDocRef = doc(
			this.firestore,
			`users/${this.currentUser.userId}`
		);
		return updateDoc(userDocRef, { status: newStatus });
	}
	// private chat
	/**
	 * Subscribes to the privateChats collection in Firestore and updates the private chat list in real-time.
	 * Orders the private chats by chat creator.
	 * Logs the updated private chat list to the console.
	 */
	subPrivateChatList() {
		const q = query(this.getPrivateChatRef(), orderBy('chatCreator'));
		this.unsubscribePrivateChatList = onSnapshot(
			q,
			(snapshot) => {
				this.privateChatList = [];
				snapshot.forEach((doc) => {
					const chat = this.setPrivateChat(doc.data(), doc.id);
					if (this.isCurrentUserInChat(chat)) {
						this.privateChatList.push(chat);
					}
				});
				console.log('Private Chat List:', this.privateChatList);
			},
			(error) => {
				console.error('Error fetching Private Chats: ', error);
			}
		);
	}

	/**
	 * Checks if the current user is part of the chat (either as creator or receiver).
	 * @param {PrivateChat} chat - The private chat object to check.
	 * @returns {boolean} True if the current user is part of the chat, otherwise false.
	 */
	isCurrentUserInChat(chat: PrivateChat): boolean {
		return (
			chat.chatCreator === this.currentUserId ||
			chat.chatReciver === this.currentUserId
		);
	}

	/**
	 * Returns a reference to the privateChats collection in Firestore.
	 * @returns {CollectionReference} A reference to the privateChats collection.
	 */
	getPrivateChatRef() {
		return collection(this.firestore, 'privateChats');
	}

	/**
	 * Creates a PrivateChat object from Firestore document data.
	 *
	 * @param {any} obj - The Firestore document data.
	 * @param {string} id - The ID of the Firestore document.
	 * @returns {PrivateChat} A PrivateChat object containing the data from the Firestore document.
	 */
	setPrivateChat(obj: any, id: string): PrivateChat {
		return {
			privatChatId: id || '',
			chatCreator: obj.chatCreator || '',
			chatReciver: obj.chatReciver || '',
			privateNoteCreator: obj.privateNoteCreator || '',
			messages: obj.messages || [],
			createdAt: obj.createdAt || '',
			createdBy: obj.createdBy || '',
		};
	}
	
	/**
	 * Retrieves the chat creator ID based on the provided private chat ID.
	 * Searches through the privateChatList to find the entry with the matching privatChatId.
	 * @param {string} privatChatId - The private chat ID to search for.
	 * @returns {string | undefined} The chat creator ID if found, otherwise undefined.
	 */
	getChatCreatorIdByDocRef(privatChatId: string) {
		const chatEntry = this.privateChatList.find(
			(chat) => chat.privatChatId === privatChatId
		);
		this.selectedPrivateChatCreatorId = chatEntry
			? chatEntry.chatCreator
			: '';
		return chatEntry ? chatEntry.chatCreator : undefined;
	}

}
