import { StorageService } from './../../../services/storage/storage.service';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ChatService } from '../../../services/chat/chat.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../services/communication/communication.service';
import { ref } from '@angular/fire/storage';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule, PickerComponent, CommonModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent implements OnDestroy {
  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService)
  storageService = inject(StorageService);


  @Input() sourceComponent: string = ''; // Variable to hold the source component's name or identifier
  @Input() placeholderText: string = ''; // Variable to hold the placeholder text for the chat input
  @Output() messageEvent = new EventEmitter<{
    message: string;
    source: string;   // to-do do we need this?
    timestamp: number; // to-do do we need this?
    taggedUser: string[];
    storageDataUrl: string;
  }>();

  messageData: FormGroup;
  iconSourceSend = 'assets/img/icons/send_dark_blue.png';


  //emoji picker
  showEmojiPicker:boolean = false;

  // tag list
  showTagContainer:boolean = false;
  // tag List for all users
  showAllUser:boolean = false;
  // tagged users
  taggedUser: string[] = [];
  taggedUserNames: string[] = [];


  // storgae data
  storageDataUrl: string = '';
  fileName: string = '';


  constructor(private fb: FormBuilder) {
    this.messageData = this.fb.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }


  ngOnDestroy(): void {
    this.taggedUser = [];
  }

  /**
   * Returns the current time in milliseconds.
   * @returns The current time in milliseconds.
   */
  getCurrentTime(): number {
    return new Date().getTime();
  }

  /**
   * Handles the form submission when the user clicks the submit button.
   * Emits the message to be sent and resets the form.
   */
  onSubmit(): void {
    if (this.messageData.invalid) {
      return;
    }
    const messageToSend = {
      timestamp: this.getCurrentTime(),     // to-do do we need this?
      message: this.messageData.value.message,
      source: this.sourceComponent,        // to-do do we need this?
      storageDataUrl: this.storageDataUrl,
      taggedUser: this.taggedUser,
    };

    this.messageEvent.emit(messageToSend);
    this.messageData.reset();
    this.taggedUser = [];
    this.storageDataUrl = '';
    console.log('Message sent:', messageToSend);
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


  //tag user code
  toggleTagUser() {
    this.showTagContainer = !this.showTagContainer;
  }

  tagChannelMember(userName: string, userId: string, index: number) {
    this.taggedUser.push(userId);
    this.taggedUserNames.push(userName);
    if (this.taggedUser.length +1  == this.firebaseService.channelList[index].members.length) {
      this.showTagContainer = false;
    }
  }

  tagChatUser(userName: string, userId: string) {
    this.taggedUser.push(userId);
    this.taggedUserNames.push(userName);
    this.showTagContainer = false;
  }

  tagUser(userName: string, userId: string,) {
    this.taggedUser.push(userId);
    this.taggedUserNames.push(userName);
    if (this.taggedUser.length +1  == this.firebaseService.userList.length) {
      this.showTagContainer = false;
    }
  }

  deleteTaggedUser(index: number) {
    this.taggedUser.splice(index, 1);
    this.taggedUserNames.splice(index, 1);
  }

  //upload file code
  uploadFile(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0);
  	this.fileName = file?.name || '';
	if (file) {
		const storageRef = ref(this.storageService.storage, `chatData/${this.chatService.docRef}/${file.name}`);
		this.storageService.uploadFile(storageRef, file).subscribe({
			next: (snapshot) => {
				this.storageService.getURL(snapshot.ref).subscribe({
					next: (url) => {
						this.storageDataUrl = url;
					},
				});
			},
		});
	}
  }

  closeAndDelete() {
	  this.deleteObject();
	  this.storageDataUrl = '';
  }

  deleteObject() {
	const storageRef = ref(this.storageService.storage, `chatData/${this.chatService.docRef}/${this.fileName}`);
	this.storageService.deleteFile(storageRef);
  }
	
}