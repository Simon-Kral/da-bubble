import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() messageEvent = new EventEmitter<string>();

  messageData: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageData = this.fb.group({
      timestamp: new FormControl(new Date().getTime()),
      message: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }

  /**
   * Handles the form submission when the user clicks the submit button.
   * Emits the entered message value and resets the form.
   */
  onSubmit(): void {
    if (this.messageData.invalid) {
      return;
    }
    this.messageEvent.emit(this.messageData.value);
    this.messageData.reset();
  }
}
