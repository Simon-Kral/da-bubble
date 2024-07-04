import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, Unsubscribe } from '@angular/fire/firestore';
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
  currenUser: any;

  channelList: Channel[] = [];
  userList: User [] = [];
  privateChatList: PrivateChat [] = [];

  unsubscribeChannelList: any;
  unsubscribeUserList: any;
  unsubscribePrivateChatList: any;


  
	constructor() {
    this.getCurrentUser();
    this.ngOnInit();
    console.log('Current User:', this.currenUser);
  }

	ngOnInit(): void {
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

  // get current user

  getCurrentUser() {
    this.currenUser = sessionStorage.getItem('currentUserId');
  }


  // channel 

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

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

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



  // user 

  
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

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  setUser(obj: any, id: string,): User {
    return {
      userId: id || "",
      name: obj.name || "",
      status: obj.status || "",
      photoURL: obj.photoURL || "",
      channels: obj.channels || [],
      email: obj.email || ""
    }
  }




  // private chat
  
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

  getPrivateChatRef() {
    return collection(this.firestore, 'privateChats');
  }

  setPrivateChat(obj: any, id: string,): PrivateChat {
    return {
      privatChatId: id || "",
      chatCreator: obj.chatCreator || "",
      chatReciver: obj.chatReciver || "",
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
