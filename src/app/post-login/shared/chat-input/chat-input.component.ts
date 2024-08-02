import { StorageService } from './../../../services/storage/storage.service';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ChatService } from '../../../services/chat/chat.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../services/communication/communication.service';
import { getDownloadURL, ref, StorageReference } from '@angular/fire/storage';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule, PickerComponent, CommonModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent implements OnDestroy, OnInit {
  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService);
  storageService = inject(StorageService);
  fileExists: boolean = false;

  @Input() sourceComponent: string = ''; // Variable to hold the source component's name or identifier
  @Input() placeholderText: string = ''; // Variable to hold the placeholder text for the chat input
  @Input() labelId: string = '';
  @Output() messageEvent = new EventEmitter<{
    message: string;
    source: string; // to-do do we need this?
    timestamp: number; // to-do do we need this?
    taggedUser: string[];
    storageData: string;
  }>();

  messageData: FormGroup;
  iconSourceSend = 'assets/img/icons/send_dark_blue.png';

  //emoji picker
  showEmojiPicker: boolean = false;

  // tag list
  showTagContainer: boolean = false;
  // tag List for all users
  showAllUser: boolean = false;
  // tagged users
  taggedUser: string[] = [];
  taggedUserNames: string[] = [];

  // storgae data
  storageData: string = '';
  fileName: string = '';
  fileType: string = '';

  constructor(private fb: FormBuilder) {
    this.messageData = this.fb.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }

  ngOnInit(): void {
    this.taggedUser = [];
    this.taggedUserNames = [];
    this.storageData = '';
    this.messageData.get('message')?.valueChanges.subscribe((value: string) => {
      this.handleMessageInput(value || '');
    });
  }

  ngOnDestroy(): void {
    this.taggedUser = [];
    this.taggedUserNames = [];
    this.storageData = '';
  }

  handleMessageInput(value: string) {
    if (typeof value !== 'string') {
      value = '';
    }

    // Check if @ is in the message
    const atSymbolEntered = value.endsWith('@');

    // Check if the @ is at the beginning of the message or if there is a space before the @
    const atIndex = value.lastIndexOf('@');
    const isAtSymbolValid = atIndex !== -1 && (atIndex === 0 || value.charAt(atIndex - 1) === ' ');

    // Make sure the @ is not part of an email address
    const isEmail = /\S+@\S+\.\S+/.test(value);

    if (atSymbolEntered && isAtSymbolValid && !isEmail) {
      this.showTagContainer = true;
    } else {
      this.showTagContainer = false;
    }
  }

  /**
   * Returns the current time in milliseconds.
   * @returns The current time in milliseconds.
   */
  getCurrentTime(): number {
    return new Date().getTime();
  }

  isStorageDataImage(storageDataUrl: string) {
    return storageDataUrl.includes('jpg') || storageDataUrl.includes('jpeg') || storageDataUrl.includes('png');
  }

  /**
   * Handles the form submission when the user clicks the submit button.
   * Emits the message to be sent and resets the form.
   */
  onSubmit(): void {
    if (this.messageData.invalid) {
      return;
    }

    // Remove '@' before each tagged user name in the message
    let message = this.messageData.value.message;
    this.taggedUserNames.forEach((userName) => {
      // Escape special characters in userName for use in regex
      const escapedUserName = userName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Create regex to find '@userName'
      const regex = new RegExp(`@${escapedUserName}`, 'g');
      message = message.replace(regex, userName); // Replace '@userName' with 'userName'
    });

    // Construct the message to send
    const messageToSend = {
      timestamp: this.getCurrentTime(), // to-do do we need this?
      message: message,
      source: this.sourceComponent, // to-do do we need this?
      storageData: this.storageData,
      taggedUser: this.taggedUser,
    };

    // Emit the message and reset form data
    this.messageEvent.emit(messageToSend);
    this.messageData.reset();
    console.log('Message sent chat input:', messageToSend);
    console.log('Storage data in child before emit:', this.storageData);

    // Clear tagged users and storage data
    this.taggedUser = [];
    this.storageData = '';
  }

  //emoji code
  /**
   * Toggles the emoji picker visibility.
   */
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
   * Adds the selected emoji to the message text and updates the form control.
   * @param event The event object containing the selected emoji.
   *              The emoji is expected to have a 'native' property representing its textual representation.
   */
  addEmoji(event: { emoji: { native: any } }) {
    let { message } = this.messageData.value;
    let text = `${message}${event.emoji.native}`;
    this.messageData.setValue({ message: text });
    this.toggleEmojiPicker();
  }

  //tag channel member code
  toggleTagContainer() {
    this.showTagContainer = !this.showTagContainer;
    console.log('showTagContainer:', this.showTagContainer);
  }

  /**
   * Tags a channel member by adding their user ID and name to the respective arrays.
   * If all channel members have been tagged, hides the tag container.
   *
   * @param userName - The name of the channel member to be tagged.
   * @param userId - The ID of the channel member to be tagged.
   * @param index - The index of the channel in the channel list.
   */
  tagChannelMember(userName: string, userId: string, index: number) {
    let { message } = this.messageData.value;

    if (message.endsWith('@') || message.endsWith(' ')) {
      message = message.trim();
    }

    let displayMessage = `${message}${userName}`;
    this.messageData.setValue({ message: displayMessage });

    this.taggedUser.push(userId);
    this.taggedUserNames.push(userName);
    this.showTagContainer = false;

    if (this.taggedUser.length + 1 === this.firebaseService.channelList[index].members.length) {
      this.showTagContainer = false;
    }
  }

  /**
   * Retrieves the list of available members who can be tagged in the current channel.
   * This excludes the current user and members who have already been tagged.
   *
   * @returns {string[]} An array of member IDs who are not the current user and have not yet been tagged.
   */
  getAvailableMembers(): string[] {
    const allMembers = this.firebaseService.channelList.flatMap((channel) => channel.members);
    const taggedMembers = new Set(this.taggedUser);
    return allMembers.filter(
      (memberId) => memberId !== this.firebaseService.currentUserId && !taggedMembers.has(memberId),
    );
  }

  /**
   * Checks if all channel members are tagged.
   *
   * @returns {boolean} True if all channel members are tagged; otherwise, false.
   */
  isAllChannelMembersTagged(): boolean {
    const allChannelMembers =
      this.firebaseService.channelList.find((channel) => channel.chanId === this.chatService.docRef)?.members || [];
    return allChannelMembers
      .filter((memberId) => memberId !== this.firebaseService.currentUserId)
      .every((memberId) => this.taggedUser.includes(memberId));
  }

  // tag all user code

  /**
   * Tags a user by adding their ID and name to the taggedUser array and updates the message.
   *
   * @param userName - The name of the user being tagged.
   * @param userId - The ID of the user being tagged.
   */
  tagUser(userName: string, userId: string) {
    let { message } = this.messageData.value;

    if (message.endsWith('@') || message.endsWith(' ')) {
      message = message.trim();
    }

    let displayMessage = `${message}${userName}`;
    this.messageData.setValue({ message: displayMessage });

    this.taggedUser.push(userId);
    this.taggedUserNames.push(userName);

    this.showTagContainer = false;
  }

  /**
   * Retrieves the list of users who are not yet tagged and excludes the current user.
   *
   * @returns {any[]} An array of user objects from the userList that are not present in the taggedUser array and are not the current user.
   */
  getAvailableUsers(): any[] {
    const taggedUserIds = new Set(this.taggedUser);
    return this.firebaseService.userList.filter(
      (user) => user.userId !== this.firebaseService.currentUserId && !taggedUserIds.has(user.userId),
    );
  }

  /**
   * Checks if all users are tagged.
   *
   * @returns {boolean} True if all users are tagged; otherwise, false.
   */
  isAllUsersTagged(): boolean {
    const allUserIds = this.firebaseService.userList
      .filter((user) => user.userId !== this.firebaseService.currentUserId)
      .map((user) => user.userId);
    return allUserIds.every((userId) => this.taggedUser.includes(userId));
  }

  //upload file code
  /**
   * Uploads a file to the storage service and updates the file name and URL.
   * @param event - The event object triggered by the file input change.
   */
  uploadFile(event: Event) {
    this.fileExists = false;
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0);
    this.fileName = file?.name || '';
    this.fileType = file?.type || '';
    console.log('File type:', this.fileType);

    if (file) {
      const storageRef = ref(this.storageService.storage, `chatData/${this.chatService.docRef}/${file.name}`);
      // Check if storageRef already exists in the database
      this.storageService.checkIfFileExists(storageRef).subscribe({
        next: (exists) => {
          if (exists) {
            console.log('File already exists in the database');
            this.fileExists = true;
          } else {
            this.storageService.uploadFile(storageRef, file).subscribe({
              next: (snapshot) => {
                this.storageService.getURL(snapshot.ref).subscribe({
                  next: (url) => {
                    this.storageData = url;
                  },
                });
              },
            });
          }
        },
      });
    }
  }

  /**
   * Closes the chat input and deletes the file from storage.
   */
  closeAndDelete() {
    this.delteFileFromStorage();
    this.storageData = '';
  }

  /**
   * Deletes a file from the storage.
   */
  delteFileFromStorage() {
    const storageRef = ref(this.storageService.storage, `chatData/${this.chatService.docRef}/${this.fileName}`);
    this.storageService.deleteFile(storageRef);
  }
}
