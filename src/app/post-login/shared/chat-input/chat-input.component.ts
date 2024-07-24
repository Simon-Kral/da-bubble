import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ChatService } from '../../../services/chat/chat.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../services/communication/communication.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule, PickerComponent, CommonModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService)

  @Input() sourceComponent: string = ''; // Variable to hold the source component's name or identifier
  @Input() placeholderText: string = ''; // Variable to hold the placeholder text for the chat input
  @Output() messageEvent = new EventEmitter<{
    message: string;
    source: string;
    timestamp: number;
  }>();

  messageData: FormGroup;
  iconSourceSend = 'assets/img/icons/send_dark_blue.png';

  //emoji picker
  showEmojiPicker:boolean = false;

  // tag list
  showTagContainer:boolean = false;
  // tag List for all users
  showAllUser:boolean = false;
  constructor(private fb: FormBuilder) {
    this.messageData = this.fb.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
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
      timestamp: this.getCurrentTime(),
      message: this.messageData.value.message,
      source: this.sourceComponent,
    };

    this.messageEvent.emit(messageToSend);
    this.messageData.reset();
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

  toggleTagUser() {
    this.showTagContainer = !this.showTagContainer;
  }

  tagUser(userName: string) {
    this.messageData.setValue({ message: '@' + userName });
  }
}
