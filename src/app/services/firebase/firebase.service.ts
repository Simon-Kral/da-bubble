import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, Unsubscribe, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { getAuth, user } from '@angular/fire/auth';
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
  userList: User [] = [];
  privateChatList: PrivateChat [] = [];

  unsubscribeChannelList: any;
  unsubscribeUserList: any;
  unsubscribePrivateChatList: any;


  
	constructor() {
    this.getCurrentUserId();
    this.ngOnInit();
    console.log('Current User ID:', this.currentUserId);
  }

	ngOnInit(): void {
    this.setCurrentUserAsObjekt();
    this.subChannelsList();
    this.subUsersList();
    this.subPrivateChatList();
  }

  ngOnDestroy(): void {
    if (this.unsubscribeChannelList){
      this.unsubscribeChannelList();
    }
    if (this.unsubscribeUserList){
      this.unsubscribeUserList();
    }
    if (this.unsubscribePrivateChatList){
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
   * 
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
    } as User;
  }
  /**
   * Sets the current user property by fetching the user data as an object from Firestore.
   * Logs the current user object to the console.
   */
  async setCurrentUserAsObjekt() {
    this.currentUser = await this.getCurrentUserAsObject();
    console.log('Current User Object',this.currentUser);
  }
  // channel code 
  /**
   * Subscribes to the channels collection in Firestore and updates the channel list in real-time.
   * Orders the channels by name.
   * Logs the updated channel list to the console.
   * TO-DO implemet filter logic to filter currentUser specific Data
   */
  subChannelsList() {
    const q = query(this.getChannelsRef(), orderBy('name'));
    this.unsubscribeChannelList = onSnapshot(q, (snapshot) => {
      this.channelList = [];
      snapshot.forEach(doc => {
        this.channelList.push(this.setChannel(doc.data(), doc.id));
      });
      console.log('Channel List:', this.channelList);
    }, (error) => {
      console.error("Error fetching channels: ", error);
    });
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
  setChannel(obj: any, id: string,): Channel {
    return {
      chanId: id || "",
      name: obj.name || "",
      description: obj.description || "",
      members: obj.members || [],
      messages: obj.messages || [],
      createdAt: obj.createdAt || "",
      createdBy: obj.createdBy || "",
    }
  }

  // user code 
  /**
   * Subscribes to the users collection in Firestore and updates the user list in real-time.
   * Orders the users by name.
   * Logs the updated user list to the console.
   */
  subUsersList() {
    const q = query(this.getUsersRef(), orderBy('name'));
    this.unsubscribeUserList = onSnapshot(q, (snapshot) => {
      this.userList = [];
      snapshot.forEach(doc => {
        this.userList.push(this.setUser(doc.data(), doc.id));
      });
      console.log('User List:', this.userList);
    }, (error) => {
      console.error("Error fetching Users: ", error);
    });
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
  setUser(obj: any, id: string,): User {
    return {
      userId: id || "",
      name: obj.name || "",
      status: obj.status || "",
      photoURL: obj.photoURL || "",
      channels: obj.channels || [],
      email: obj.email || "",
      privateNoteRef: obj.privateNoteRef || "",
    }
  }

  // private chat
    /**
   * Subscribes to the privateChats collection in Firestore and updates the private chat list in real-time.
   * Orders the private chats by chat creator.
   * Logs the updated private chat list to the console.
   * TO-DO implemet filter logic to filter currentUser specific Data
   */
  subPrivateChatList() {
    const q = query(this.getPrivateChatRef(), orderBy('chatCreator'));
    this.unsubscribePrivateChatList = onSnapshot(q, (snapshot) => {
      this.privateChatList = [];
      snapshot.forEach(doc => {
        this.privateChatList.push(this.setPrivateChat(doc.data(), doc.id));
      });
      console.log('Private Chat List:', this.privateChatList);
    }, (error) => {
      console.error("Error fetching Private Chats: ", error);
    });
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
  setPrivateChat(obj: any, id: string,): PrivateChat {
    return {
      privatChatId: id || "",
      chatCreator: obj.chatCreator || "",
      chatReciver: obj.chatReciver || "",
      privateNoteCreator: obj.privateNoteCreator || "",
      messages: obj.messages || [],
      createdAt: obj.createdAt || "",
      createdBy: obj.createdBy || ""
    }
  }











// this is the original code


	getUserChannels() {
		//onSnapshot(this.getUserChannelsFilter(), (snapshot) => {
		//	snapshot.docChanges().forEach((doc) => {});
		//});
	}

	getChannelsCollection() {
		return collection(this.firestore, 'channels');
	}

	getUserChannelsFilter() {
		// console.log('fetching user-channels with user:', this.authService.currentUserSig());
		// console.log('user-id', getAuth().currentUser?.displayName);
		// return query(this.getChannelsCollection(), where('members', 'array-contains', getAuth().currentUser?.displayName));
	}
}
