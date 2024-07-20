import { Component, inject, OnDestroy } from '@angular/core';
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
export class NewMessageComponent implements OnDestroy {
  chatService = inject(ChatService);
  searchService = inject(SearchService);
  firebaseService = inject(FirebaseService);

  searchText: FormGroup;

  searchInput: string = '';

  showUsersByEmail: boolean = false;
  showUsers: boolean = false;
  showChannels: boolean = false;
  isFocusActive: boolean = false;

  constructor(private fb: FormBuilder) {
		this.searchText = this.fb.group({
			search: ['']
		});
	}

  ngOnDestroy() {
    this.searchService.selectedUser = [];
    this.chatService.selectedPrivateChatReciver = '';
    this.searchService.selectedChannel = '';
  }

  handleSearch() {
    let searchInput  = this.searchText.get('search')?.value || '';
    this.searchInput = searchInput;
    
    if (searchInput.startsWith('@')) {
        this.isFocusActive = false;
        this.showUsers = true;
        this.showChannels = false;
        this.showUsersByEmail = false
        this.searchService.onUserSearch(searchInput.slice(1)); 
    } else if (searchInput.startsWith('#')) {
        this.isFocusActive = false;
        this.showUsers = false;
        this.showUsersByEmail = false;
        this.showChannels = true;
        this.searchService.onChannelSearch(searchInput.slice(1)); 
    } else if (searchInput.length > 0) {
        this.isFocusActive = false;
        this.showUsers = false;
        this.showChannels = false;
        this.showUsersByEmail = true;
        this.searchService.onEmailSearch(searchInput); 
    } else if (searchInput.length == 0) {
      this.isFocusActive = true;
      this.showUsers = false;
      this.searchService.userSearchResults = [];
      this.showChannels = false;
      this.searchService.channelSearchResults = [];
      this.showUsersByEmail = false;
  }

    console.log('Search text received by searchService:', searchInput);
}

removeSelectedChannel() {
  this.chatService.mainCollection = '';
  this.chatService.docRef = '';
  this.searchService.selectedChannel = '';
  this.searchText.get('search')?.setValue('');
  this.chatService.placeholderName = '';
}

removeSelectedUser(userId: string) {
  this.searchService.removeSelectedUserFromArray(userId);
  this.chatService.mainCollection = '';
  this.chatService.selectedPrivateChatReciver = '';
  this.searchService.selectedUser = [];
  this.searchText.get('search')?.setValue('');
  this.chatService.placeholderName = '';
}

handleClickOnUser(userId: string) {
  this.chatService.mainCollection = 'privateChats';
  this.chatService.selectedPrivateChatReciver = userId;
  this.searchService.selectedUser = [userId];
  this.showUsers = false;
  this.showUsersByEmail = false;
  this.isFocusActive = false;
  this.searchText.get('search')?.setValue('');
  this.searchService.unSubscribeOnUserSearch();
  this.chatService.placeholderName = this.firebaseService.getUserDisplayName(userId);
}

handleClickOnChannel(chanId: string) {
  this.chatService.mainCollection = 'channels';
  this.chatService.docRef = chanId;
  this.searchService.selectedChannel = chanId;
  this.showChannels = false;
  this.isFocusActive = false;
  this.searchText.get('search')?.setValue('');
  this.searchService.unSubscribeOnChannelSearch();
  this.chatService.initializeChannelPlaceholder(chanId);
}



handleFocus() {
  this.isFocusActive = !this.isFocusActive;
  this.showUsers = false;
  this.showChannels = false;
  this.showUsersByEmail = false;
}

}
