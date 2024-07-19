import { Component, inject } from '@angular/core';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';
import { ChatService } from '../../services/chat/chat.service';
import { SearchService } from '../../services/search/search.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [ChatInputComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  chatService = inject(ChatService);
  searchService = inject(SearchService);
  firebaseService = inject(FirebaseService);

  searchText: FormGroup;

  showUsersByEmail: boolean = false;
  showUsers: boolean = false;
  showChannels: boolean = false;
  isFocusActive: boolean = false;

  constructor(private fb: FormBuilder) {
		this.searchText = this.fb.group({
			search: ['']
		});
	}

  handleSearch() {
    const searchInput = this.searchText.get('search')?.value || '';

    if (searchInput.startsWith('@')) {
        this.isFocusActive = false;
        this.showUsers = true;
        this.showChannels = false;
        this.searchService.onUserSearch(searchInput.slice(1)); 
    } else if (searchInput.startsWith('#')) {
        this.isFocusActive = false;
        this.showUsers = false;
        this.showChannels = true;
        this.searchService.onChannelSearch(searchInput.slice(1)); 
    } else {
        this.isFocusActive = false;
        this.showUsers = false;
        this.showChannels = false;
        this.showUsersByEmail = true;
        this.searchService.onEmailSearch(searchInput); 
    }

    console.log('Search text received by searchService:', searchInput);
}

removeSelectedChannel() {
  this.chatService.mainCollection = '';
  this.chatService.docRef = '';
  this.searchService.selectedChannel = '';
  this.searchText.get('search')?.setValue('');
}

removeSelectedUser(userId: string) {
  this.searchService.removeSelectedUserFromArray(userId);
  this.chatService.mainCollection = '';
  this.chatService.selectedPrivateChatReciver = '';
  this.searchService.selectedUser = [];
  this.searchText.get('search')?.setValue('');
}

handleClickOnMember(userId: string) {
  this.chatService.mainCollection = 'privateChats';
  this.chatService.selectedPrivateChatReciver = userId;
  this.searchService.selectedUser = [userId];
  this.showUsers = false;
  this.showUsersByEmail = false;
  this.isFocusActive = false;
  this.searchText.get('search')?.setValue('');
}

handleClickOnChannel(channelId: string) {
  this.chatService.mainCollection = 'channels';
  this.chatService.docRef = channelId;
  this.searchService.selectedChannel = channelId;
  this.showChannels = false;
  this.isFocusActive = false;
  this.searchText.get('search')?.setValue('');
}



handleFocus() {
  this.isFocusActive = !this.isFocusActive;
}

}
