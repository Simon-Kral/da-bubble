import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, Unsubscribe } from '@angular/fire/firestore';
import { AuthService } from '../authentication/auth.service';
import { getAuth, user } from '@angular/fire/auth';
@Injectable({
	providedIn: 'root',
})
export class FirebaseService implements OnDestroy, OnInit {
	authService = inject(AuthService);
	firestore: Firestore = inject(Firestore);

	constructor() {}

	ngOnInit(): void {}

	getUserChannels() {
		onSnapshot(this.getUserChannelsFilter(), (snapshot) => {
			snapshot.docChanges().forEach((doc) => {});
		});
	}

	getChannelsCollection() {
		return collection(this.firestore, 'channels');
	}

	getUserChannelsFilter() {
		// console.log('fetching user-channels with user:', this.authService.currentUserSig());
		// console.log('user-id', getAuth().currentUser?.displayName);
		return query(this.getChannelsCollection(), where('members', 'array-contains', getAuth().currentUser?.displayName));
	}

	ngOnDestroy(): void {}
}
