import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule, PickerComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
 
  @Input() sourceComponent: string =''; // Variable to hold the source component's name or identifier
  @Input() placeholderText: string =''; // Variable to hold the placeholder text for the chat input
  @Output() messageEvent = new EventEmitter<{ message: string, source: string, timestamp: number }>();

  messageData: FormGroup;
  iconSourceAdd = 'assets/img/icons/add_grey.png';
  iconSourceSmiley = 'assets/img/icons/smiley_grey.png';
  iconSourceAlternateEmail = 'assets/img/icons/alternate_email_grey.png';
  iconSourceSend = 'assets/img/icons/send_dark_blue.png';

  //emoji picker
  showEmojiPicker = false;


  constructor(private fb: FormBuilder) {
    this.messageData = this.fb.group({
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  /**
   * Returns the current time in milliseconds.
   *
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
  addEmoji(event: { emoji: { native: any; }; }) {
    let { message } = this.messageData.value;
    let text = `${message}${event.emoji.native}`;

    this.messageData.setValue({ message: text });
  }
  /**
   * Handles the mouse over event for the chat input icons.
   * Changes the icon source based on the provided image name.
   * @param imgName - The name of the image being hovered over.
   */
  onMouseOver(imgName: string): void {
    switch (imgName) {
      case 'add':
        this.iconSourceAdd = 'assets/img/icons/add_blue.png';
        break;
      case 'smiley':
        this.iconSourceSmiley = 'assets/img/icons/smiley_blue.png';
        break;
      case 'alternate_email':
        this.iconSourceAlternateEmail = 'assets/img/icons/alternate_email_blue.png';
        break;
      case 'send':
        this.iconSourceSend = 'assets/img/icons/send_ligth_blue.png';
        break;
      default:
        break;
    }
  }

  /**
   * Handles the mouse out event for the specified image.
   * @param imgName - The name of the image.
   */
  onMouseOut(imgName: string): void {
    switch (imgName) {
      case 'add':
        this.iconSourceAdd = 'assets/img/icons/add_grey.png';
        break;
      case 'smiley':
        this.iconSourceSmiley = 'assets/img/icons/smiley_grey.png';
        break;
      case 'alternate_email':
        this.iconSourceAlternateEmail = 'assets/img/icons/alternate_email_grey.png';
        break;
      case 'send':
        this.iconSourceSend = 'assets/img/icons/send_dark_blue.png';
        break;
      default:
        break;
    }
  }
}
