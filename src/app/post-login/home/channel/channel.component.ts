import { FirebaseService } from './../../../services/firebase/firebase.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../../shared/chat-input/chat-input.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ChannelDetailsComponent } from './channel-details/channel-details.component';
import { ChatHistoryComponent } from '../../shared/chat-history/chat-history.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, ChatInputComponent, ChannelDetailsComponent, ChatHistoryComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  showChannelDetails = false;
  hashtag = 'assets/img/icons/hashtag_chat_inactive.png';
  dropdownArrow = 'assets/img/icons/keyboard_arrow_down_inactive.png';

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

  ngOnInit(): void {
  }

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

  toggleShowChannelDetails() {
	this.chatService.toggleChannelDetailsVisibility(!this.showChannelDetails);
  }

  toggleImgSrc() {
	this.hashtag = this.hashtag === 'assets/img/icons/hashtag_chat_inactive.png' ? 'assets/img/icons/hashtag_chat_active.png' : 'assets/img/icons/hashtag_chat_inactive.png';
	this.dropdownArrow = this.dropdownArrow === 'assets/img/icons/keyboard_arrow_down_inactive.png' ? 'assets/img/icons/keyboard_arrow_up_active.png' : 'assets/img/icons/keyboard_arrow_down_inactive.png';
  }

}
