import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, ChatInputComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  users = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'Ä',
      phone: '1234567890',
      profileImg: 'assets/img/character-images/character_1.png'
    },
    {
      id: 2,
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'B',
      phone: '9876543210',
      profileImg: 'assets/img/character-images/character_2.png'
    },
    {
      id: 3,
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'C',
      phone: '5555555555',
      profileImg: 'assets/img/character-images/character_3.png'
    },
  ]

  /**
   * Returns the left style value for a chat component item based on the given index.
   * @param index - The index of the chat component item.
   * @returns The left style value as a string.
   */
  getLeftStyleValue(index: number): string {
    return (index * 28).toString();
  }

  handleMessage(message: object): void {
    console.log(message);
  }
}
