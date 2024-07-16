import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Channel } from '../../../../../models/channel.class';
import { FirebaseService } from '../../../../../services/firebase/firebase.service';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss',
})
export class CreateNewChannelComponent {
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);

  channelData: FormGroup;
  channel = new Channel();
  isCreateChannelFormVisible: boolean = true;  // to-do: Change Variable Name
  isAddMemberVisibleForm: boolean = true;

  showChannelSerach: boolean = false;
  showUserSearch: boolean = false;

  selectedMembers: string[] = [];
  newChanId = '';
  chanNameExists: boolean = false;
  errorMsgChanExists: string = 'Channel Name existiert bereits!';
  errorMsgChanNameInvalid: string = 'Bitte geben Sie einen gültigen Channel-Namen ein.';

  // Default icon sources
	close = '../../../../assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = '../../../../assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;

  @Input() isCreateChannelVisible: boolean = false;
  @Output() createChannelVisibilityChange = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    this.channelData = this.fb.group({
      channelName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      channelDescription: new FormControl(''),
    });
  }

  /**
   * Creates a new channel based on the data in `channelData` form group.
   * If form is valid, it adds a new channel document to Firestore and updates the document with its ID.
   * Logs errors if adding or updating fails.
   * to-do use setChannel method from firebase service
   */
  async createChannel() {
    if (this.channelData.valid) {
      const channelValues = this.channelData.value;

      try {
        const ChanNameExists = await this.firebaseService.checkChannelNameExists(channelValues.channelName);

        if (ChanNameExists) {
          this.chanNameExists = true;
          return; 
        }

        let newChannel: Channel = {
          chanId: '',
          name: channelValues.channelName,
          description: channelValues.channelDescription,
          members: [this.firebaseService.currentUserId],
          createdAt: new Date().getTime(),
          createdBy: this.firebaseService.currentUserId,
        };

        const docRef = await this.addChannel(newChannel);
        await this.updateChannelId(docRef);
        await this.firebaseService.updateUserChannel(docRef.id)
        this.channelData.reset();
        this.toggleCreateChannelFormVisibility(); 
        this.toggleAddMemberFormVisibility(); 
      } catch (e) {
        console.error('Error adding/updating document: ', e);
      }
    } else {
      console.log('Form is not valid');
    }
  }
  /**
   * Adds a new channel document to Firestore.
   * @param channelData The channel data to be added.
   * @returns The document reference after the document is added.
   * @throws Error if there is an issue adding the document.
   */
  async addChannel(channelData: Channel): Promise<any> {
    try {
      const docRef = await addDoc(
        collection(this.firestore, 'channels'),
        channelData
      );
      console.log('Document added with ID: ', docRef.id);
      return docRef;
    } catch (e) {
      console.error('Error adding document: ', e);
      throw e;
    }
  }
  /**
   * Updates the `id` field of a channel document in Firestore.
   * @param docRef The document reference object containing the ID of the document to update.
   * @throws Error if there is an issue updating the document.
   */

  async updateChannelId(docRef: any): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, 'channels', docRef.id), {
        chanId: docRef.id,
      });
      this.newChanId = docRef.id;
      console.log('Document updated with ID: ', docRef.id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }
/**
 * Adds selected members to the channel.
 * If selected members array contains data it updates the channel document in Firestore.
 * Logs success or error messages accordingly.
 */
  addMemberToChannel() {
    if (this.selectedMembers.length > 0 ) {
      this.updateChannelMembers(this.selectedMembers)
        .then(() => {
          console.log('Members added successfully');
          this.selectedMembers = []; 
          this.newChanId = '';
          this.toggleAddMemberFormVisibility(); 
        })
        .catch((error) => {
          console.error('Error adding members: ', error);
        });
    } else {
      console.log('No members selected');
    }
  }
/**
 * Updates the members array of a channel document in Firestore.
 * @param {string} channelId - The ID of the channel document to update.
 * @param {string[]} members - The array of members to add to the channel.
 * @returns {Promise<void>} - A promise that resolves when the document is updated.
 * @throws {Error} - Throws an error if updating the document fails.
 */
  async updateChannelMembers( members: string[]): Promise<void> {
    try {
      const channelDocRef = doc(this.firestore, 'channels', this.newChanId);
      await updateDoc(channelDocRef, {
        members: members,
      });
      console.log('Document updated with members: ', members);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

   /**
   * Adds a user to the selected members array if not already present.
   * @param {string} userId - The ID of the user to add.
   */
   pushSelectedUserToArray(userId: string) {
    if (!this.selectedMembers.includes(userId)) {
      this.selectedMembers.push(userId);
      console.log('Selected Members:', this.selectedMembers);
    }
  }

  toggleSearchInput(name: string) {
    if (name === 'channel') {
      this.showChannelSerach = !this.showChannelSerach;
    } else if (name === 'user') {
      this.showUserSearch = !this.showUserSearch;
    }
  }

  // Toggles the visibility of the create channel component
  toggleCreateChannelVisibility() {
    this.isCreateChannelVisible = !this.isCreateChannelVisible;
    this.createChannelVisibilityChange.emit(this.isCreateChannelVisible);
  }
  // Toggles the visibility of the create channel form
  toggleCreateChannelFormVisibility() {
    this.isCreateChannelFormVisible = !this.isCreateChannelFormVisible;
  }
  // Toggles the visibility of the add member form
  toggleAddMemberFormVisibility() {
    this.isAddMemberVisibleForm = !this.isAddMemberVisibleForm;
    if (this.isAddMemberVisibleForm === false) {
      this.toggleCreateChannelVisibility();
    }
  }
	/**
	 * Handles the mouse over event for the sideNav icons.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
  }

}
