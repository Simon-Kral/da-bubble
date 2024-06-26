import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  @Output() messageEvent = new EventEmitter<object>();

  messageData: FormGroup;
  iconSourceAdd = 'assets/img/icons/add_grey.png';
  iconSourceSmiley = 'assets/img/icons/smiley_grey.png';
  iconSourceAlternateEmail = 'assets/img/icons/alternate_email_grey.png';
  iconSourceSend = 'assets/img/icons/send_dark_blue.png';

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
    };

    this.messageEvent.emit(messageToSend);
    this.messageData.reset();
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
