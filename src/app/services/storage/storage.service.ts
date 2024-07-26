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

	/**
	 * Retrieves the download URL for the given storage reference.
	 * @param storageRef - The storage reference to get the download URL for.
	 * @returns An observable that emits the download URL as a string.
	 */
	getURL(storageRef: StorageReference): Observable<string> {
		const promise = getDownloadURL(storageRef);
		return from(promise);
	}

	/**
	 * Uploads a file to the specified storage reference.
	 * @param storageRef - The storage reference to upload the file to.
	 * @param file - The file to be uploaded.
	 * @returns An Observable that emits the upload progress and completion status.
	 */
	uploadFile(storageRef: StorageReference, file: File) {
		const promise = uploadBytes(storageRef, file);
		return from(promise);
	}


	/**
	 * Deletes a file from the storage.
	 * 
	 * @param storageRef - The reference to the file in the storage.
	 */
	deleteFile(storageRef: StorageReference) {
		deleteObject(storageRef).then(() => {
		console.log('File deleted successfully');
		}).catch((error) => {
		console.log('Error deleting file:', error);
		}); 
	}

	
}