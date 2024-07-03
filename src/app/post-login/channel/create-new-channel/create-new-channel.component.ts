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
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss',
})
export class CreateNewChannelComponent {
  firestore: Firestore = inject(Firestore);

  channelData: FormGroup;
  channel = new Channel();

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
 */
  async createChannel() {
    if (this.channelData.valid) {
      const channelValues = this.channelData.value;
      let newChannel: Channel = {
        chanId: '',
        name: channelValues.channelName,
        description: channelValues.channelDescription,
        members: [],
        messages: [],
        createdAt: new Date().getTime(),
        createdBy: 'test',
      };

      try {
        const docRef = await this.addChannel(newChannel);
        await this.updateChannelId(docRef);
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
      const docRef = await addDoc(collection(this.firestore, 'channels'), channelData);
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
        id: docRef.id,
      });
      console.log('Document updated with ID: ', docRef.id);
    } catch (e) {
      console.error('Error updating document: ', e);
      throw e;
    }
  }

  toggleCreateChannelVisibility() {
    this.isCreateChannelVisible = !this.isCreateChannelVisible;
    this.createChannelVisibilityChange.emit(this.isCreateChannelVisible);
    console.log('toggleCreateChannelVisibility', this.isCreateChannelVisible);
  }
}
