import { Injectable } from '@angular/core';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	StorageReference,
	uploadBytes,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	storage = getStorage();
	profilePicturesRef = ref(this.storage, 'profilePictures');

	constructor() {}

	getURL(storageRef: StorageReference): Observable<string> {
		const promise = getDownloadURL(storageRef);
		return from(promise);
	}

	uploadFile(storageRef: StorageReference, file: File) {
		const promise = uploadBytes(storageRef, file);
		return from(promise);
	}

	
	deleteFile(storageRef: StorageReference) {
		deleteObject(storageRef).then(() => {
		console.log('File deleted successfully');
		}).catch((error) => {
		console.log('Error deleting file:', error);
		}); 
	}
}
