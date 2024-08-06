import { Injectable, inject } from '@angular/core';
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
  setDoc,
  addDoc,
  CollectionReference,
  deleteDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { Channel } from '../../models/channel.class';
import { User } from '../../models/user.class';
import { PrivateChat } from '../../models/privateChat.class';
import { PrivateNote } from '../../models/privateNote.class';
import { Message } from '../../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  // services
  authService = inject(AuthService);
  firestore: Firestore = inject(Firestore);

  // place for variables
  currentUserId: any;
  currentUser: User = new User();

  // lists for channels, users and private chats
  channelList: Channel[] = [];
  userList: User[] = [];
  privateChatList: PrivateChat[] = [];
  privateNoteList: PrivateNote[] = [];

  // unsubscribe functions for real-time updates
  unsubscribeChannelList: any;
  unsubscribeUserList: any;
  unsubscribePrivateChatList: any;
  unsubscribePrivateNoteList: any;

  // date conversion
  weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  constructor() {
    this.getCurrentUserId();
    console.log('Current User ID:', this.currentUserId); // to-do remove after developement is finished
  }

  subscribeAllLists() {
    this.subChannelsList();
    this.subUsersList();
    this.subPrivateChatList();
    this.subPrivateNoteList();
  }

  unsubscribeAllLists() {
    if (this.unsubscribePrivateChatList) {
      this.unsubscribePrivateChatList();
    }
    if (this.unsubscribeChannelList) {
      this.unsubscribeChannelList();
    }
    if (this.unsubscribeUserList) {
      this.unsubscribeUserList();
    }
    if (this.unsubscribePrivateNoteList) {
      this.unsubscribePrivateNoteList();
    }
  }

	/**
	 * Sets initial database entries for the logged-in user.
	 * @returns {void}
	 */
	setInitialDatabaseEntries(username?: string): void {
		const userId = this.authService.firebaseAuth.currentUser!.uid;
		const userDoc = doc(this.firestore, 'users', userId);
		const privateChatDoc = doc(this.firestore, 'privateNotes', userId);
    setDoc(userDoc, this.setUserObject(username)).then(() => {
      setDoc(privateChatDoc, this.setPrivateNoteObject()).then(()=>{
      });
    });
	}

  setGuestExampleData(): void {
		const userId = 'zk9QdkeUKIMaqGA7ySU1pUyP8d62';
    setDoc(doc(this.firestore, 'users', userId), this.setUserObject()).then(() => {
      setDoc(doc(this.firestore, 'privateNotes', userId), this.setPrivateNoteObject()).then(() => {
        this.addGuestChannel().then(() => {
          this.addGuestPrivateChat().then(() => {})
        })
      });
    });
	}

  addGuestChannel() {
    const ids = {userId: 'zk9QdkeUKIMaqGA7ySU1pUyP8d62', channelId: 'yh1LXpvXcOWY2hZOEfZ2', messageId: 'wcn0pm1gYnyxdnGakVQo', initialThreadMessageId: 'uZMq0kPFjgNhfsrqj2wr', threadAnswerId: 'qxrtLFBMzSjENsgCAUqO'}
    const channelsDoc = doc(this.firestore, 'channels', ids.channelId);
    const messageDoc = doc(channelsDoc, 'messages', ids.messageId);
    const initialThreadMessageDoc = doc(messageDoc, 'messageAnswers', ids.initialThreadMessageId);
    const threadAnswerDoc = doc(messageDoc, 'messageAnswers', ids.threadAnswerId);
    const promise = 
    this.deleteMessagesWithAnswers(ids).then(() => {
      deleteDoc(doc(this.firestore, 'channels', ids.channelId)).then(() => {
        setDoc(doc(this.firestore, 'channels', ids.channelId), this.setGuestChannel(ids.userId)).then(() => {
          const newMessage = this.setGuestMessage(ids);
          setDoc(messageDoc, newMessage).then(() => {
            const threadMessage = this.setGuestThreadMessage(ids);
            setDoc(initialThreadMessageDoc, threadMessage).then(() => {
              const threadAnswer = this.setGuestThreadAnswer(ids);
              setDoc(threadAnswerDoc, threadAnswer).then(() => {})
            })
          })
        })
      })
    })
    return promise;
  }

  deleteMessagesWithAnswers(ids: {userId: string, channelId: string, messageId: string, initialThreadMessageId: string, threadAnswerId: string}) {
    const promise = getDocs(collection(this.firestore, 'channels', ids.channelId, 'messages')).then((docs) => {
      docs.docs.forEach((doc) => {
        getDocs(collection(this.firestore, 'channels', ids.channelId, 'messages', doc.id, 'messageAnswers')).then((docs) => {
          docs.docs.forEach((doc) => {
            deleteDoc(doc.ref).then(() => {})
          })
        })
        deleteDoc(doc.ref).then(() => {})
      })
    })
    return promise;
  }

  addGuestPrivateChat() {
    const privateChatId = 'jCOseDfos4U2G9XkG5S0'
    const promise =
    this.deleteMessages(privateChatId).then(() => {
      setDoc(doc(this.firestore, 'privateChats', privateChatId), this.setGuestPrivateChat()).then(() => {
        setDoc(doc(this.firestore, 'privateChats', privateChatId, 'messages', '9hgkOYlnJN5GXPI3CBoF'), this.setGuestPrivateMessage(privateChatId)).then(() => {})
      })
    })
    return promise;
  }

  deleteMessages(privateChatId: string) {
    const promise = getDocs(collection(this.firestore, 'privateChats', privateChatId, 'messages')).then((docs) => {
      docs.docs.forEach((doc) => {
        deleteDoc(doc.ref).then(() => {})
      })
    })
    return promise
  }

  setGuestPrivateMessage(chatId: string) {
    return {
      messageId: '',
      text: 'Hallo, wie geht es dir?',
      chatId: chatId,
      date: this.convertDate(),
      time: Date.now().toString(),
      messageSendBy: 'tacaNwHF8SPuTfJFbpCz2J2aIPH2',
      reactions: [],
      threadId: '',
      answerCount: 0,
      lastAnswer: Date.now().toString(),
      editCount: 0,
      lastEdit: '',
      taggedUser: [],
      storageData: '',
    }
  }

  setGuestPrivateChat() {
    return { chatCreator: "zk9QdkeUKIMaqGA7ySU1pUyP8d62", chatReciver: "tacaNwHF8SPuTfJFbpCz2J2aIPH2", privatChatId: "jCOseDfos4U2G9XkG5S0" }
  }

  setGuestChannel(userId: string) {
    return {
      chanId: '',
      name: 'Gast-Channel',
      description: 'Dies ist ein Beispiel-Channel für den Gast-Benutzer',
      members: [userId, 'tacaNwHF8SPuTfJFbpCz2J2aIPH2'],
      createdAt: this.convertDate(),
      createdBy: userId,
    }
  }

  setGuestMessage(ids: {userId: string, channelId: string, messageId: string, initialThreadMessageId: string, threadAnswerId: string}) {
    return {
      messageId: '',
      text: 'Welche Version von Angular ist die aktuelle?',
      chatId: ids.channelId,
      date: this.convertDate(),
      time: Date.now().toString(),
      messageSendBy: 'tacaNwHF8SPuTfJFbpCz2J2aIPH2',
      reactions: [{
        amount: 1,
        messageId: "wcn0pm1gYnyxdnGakVQo",
        nativeEmoji: "👍",
        reactionId: "1F44D",
        user: ["zk9QdkeUKIMaqGA7ySU1pUyP8d62"]
      }],
      threadId: '',
      answerCount: 2,
      lastAnswer: Date.now().toString(),
      editCount: 0,
      lastEdit: '',
      taggedUser: [],
      storageData: '',
    }
  }

  setGuestThreadMessage(ids: {userId: string, channelId: string, messageId: string, initialThreadMessageId: string, threadAnswerId: string}) {
    return {
      messageAnswerId: '',
      text: 'Welche Version von Angular ist die aktuelle?',
      messageId: ids.initialThreadMessageId,
      date: new Date().toLocaleDateString(),
      time: Date.now().toString(),
      messageSendBy: 'tacaNwHF8SPuTfJFbpCz2J2aIPH2',
      reactions: [],
      editCount: 0,
      lastEdit: '',
      storageData: '',
      taggedUser: [],
    }
  }

  setGuestThreadAnswer(ids: {userId: string, channelId: string, messageId: string, initialThreadMessageId: string, threadAnswerId: string}) {
    return {
      messageAnswerId: ids.threadAnswerId,
      text: 'Es scheint die Version 18.1.1 zu sein.',
      messageId: ids.initialThreadMessageId,
      date: new Date().toLocaleDateString(),
      time: Date.now().toString(),
      messageSendBy: ids.userId,
      reactions: [],
      editCount: 0,
      lastEdit: '',
      storageData: '',
      taggedUser: [],
    }
  }

  convertDate() {
    return `${this.weekday[new Date().getDay()]}, ${new Date().getDate()}. ${this.months[new Date().getMonth()]}`;
  }

  /**
   * Creates a user object for Firestore.
   * @param {string} [username] - Optional username for the user.
   * @returns {Object} The user object.
   */
  setUserObject(username?: string): Object {
    const user = this.authService.firebaseAuth.currentUser!;
    return {
      userId: user.uid,
      name: username ? username : user.displayName ? user.displayName : 'Gast',
      status: true,
      photoURL: user.photoURL ? user.photoURL : 'assets/img/character-images/character_1.png',
      channels: [],
      email: user.email ? user.email : 'gast@gast.com',
      privateNoteRef: user.uid,
    };
  }

  /**
   * Creates a private note object for Firestore.
   * @returns {Object} The private chat object.
   */
  setPrivateNoteObject(): Object {
    const user = this.authService.firebaseAuth.currentUser!;
    return {
      privatChatId: user.uid,
      privateNoteCreator: user.uid,
    };
  }

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
    const userQuery = query(collection(this.firestore, 'users'), where('userId', '==', this.currentUserId));
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
   */
  subChannelsList() {
    const channelsCollection = collection(this.firestore, 'channels');
    const q = query(channelsCollection, orderBy('name'));
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
      },
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

  /**
   * Updates the members array of a specific channel document by adding new user IDs.
   * @param {string} chanId - The ID of the channel document.
   * @param {string[]} userIds - An array of user IDs to be added to the members array.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async updateChannelMembersArray(chanId: string, userIds: string[]): Promise<void> {
    const channelDocRef = doc(this.firestore, `channels/${chanId}`);
    try {
      await updateDoc(channelDocRef, {
        members: arrayUnion(...userIds),
      });
      console.log(`Members array updated for channel ID: ${chanId}`);
    } catch (e) {
      console.error(`Error updating members array for channel ID: ${chanId}`, e);
      throw e;
    }
  }
  getChannelNameById(chanId: string) {
    return this.channelList.find((channel) => channel.chanId === chanId)?.name;
  }
  // user code
  /**
   * Subscribes to the users collection in Firestore and updates the user list in real-time.
   * Orders the users by name.
   * Logs the updated user list to the console.
   */
  subUsersList() {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, orderBy('name'));
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
      },
    );
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
    const userDocRef = doc(this.firestore, `users/${this.currentUser.userId}`);
    return updateDoc(userDocRef, updates);
  }

  /**
   * Updates the user avatar in the Firestore database.
   * @param {string} newAvatarPath - The new avatar path to update.
   * @returns {Promise<void>} A promise that resolves when the user avatar is successfully updated.
   */
  updateUserAvatar(newAvatarPath: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${this.currentUser.userId}`);
    return updateDoc(userDocRef, { photoURL: newAvatarPath });
  }

  /**
   * Updates the user status for the currentUser in the Firestore database.
   * @param {boolean} newStatus - The new status to update.
   * @returns {Promise<void>} A promise that resolves when the user status is successfully updated.
   */
  updateUserStatus(newStatus: boolean): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${this.currentUser.userId}`);
    return updateDoc(userDocRef, { status: newStatus });
  }

  /**
   * Updates the channels array for multiple users by adding a new channel ID.
   *
   * @param {string[]} userIds - An array of user IDs.
   * @param {string} chanId - The channel ID to be added.
   * @returns {Promise<void[]>} A promise that resolves when all updates are complete.
   */
  updateUserChannelsArray(userIds: string[], chanId: string): Promise<void[]> {
    const updatePromises = userIds.map((userid) => {
      const userDocRef = doc(this.firestore, `users/${userid}`);
      return updateDoc(userDocRef, {
        channels: arrayUnion(chanId),
      });
    });
    return Promise.all(updatePromises);
  }

  // private chat
  /**
   * Subscribes to the privateChats collection in Firestore and updates the private chat list in real-time.
   * Orders the private chats by chat creator.
   * Logs the updated private chat list to the console.
   */
  subPrivateChatList() {
    const privateChatCollection = collection(this.firestore, 'privateChats');
    const q = query(privateChatCollection, orderBy('chatCreator'));
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
      },
    );
  }

  /**
   * Checks if the current user is part of the chat (either as creator or receiver).
   * @param {PrivateChat} chat - The private chat object to check.
   * @returns {boolean} True if the current user is part of the chat, otherwise false.
   */
  isCurrentUserInChat(chat: PrivateChat): boolean {
    return chat.chatCreator === this.currentUserId || chat.chatReciver === this.currentUserId;
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
    };
  }

  // private note
  /**
   * Subscribes to the privateNotes collection in Firestore and updates the private chat list in real-time.
   * Logs the updated private chat list to the console.
   */
  subPrivateNoteList() {
    const privateChatCollection = collection(this.firestore, 'privateNotes');
    this.unsubscribePrivateNoteList = onSnapshot(
      privateChatCollection,
      (snapshot) => {
        this.privateNoteList = [];
        snapshot.forEach((doc) => {
          const note = this.setPrivateNote(doc.data(), doc.id);
          if (note.privateNoteCreator === this.currentUserId) {
            this.privateNoteList.push(note);
          }
        });
        console.log('Private Note List:', this.privateNoteList);
      },
      (error) => {
        console.error('Error fetching Private Notes: ', error);
      },
    );
  }
  /**
   * Creates a PrivateNote object from Firestore document data.
   *
   * @param {any} obj - The Firestore document data.
   * @param {string} id - The ID of the Firestore document.
   * @returns {PrivateNote} A PrivateNote object containing the data from the Firestore document.
   */
  setPrivateNote(obj: any, id: string): PrivateNote {
    return {
      privatNoteId: id || '',
      privateNoteCreator: obj.privateNoteCreator || '',
    };
  }

  /**
   * Updates the channels array of a user by adding a new channel ID.
   *
   * @param {string} userid - The ID of the user.
   * @param {string} chanId - The ID of the channel to be added.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  updateUserChannelsbyId(userid: string, chanId: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userid}`);
    return updateDoc(userDocRef, {
      channels: arrayUnion(chanId),
    });
  }
}


