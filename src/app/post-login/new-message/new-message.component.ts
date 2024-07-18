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
  selectedPrivateChatReciver: string = '';  // will get used to store the id of the selected private chat reciver
  destinationCollection: string = 'privateChats'; // will get used to store the collection name of the destination (channels or privateChats)
  destinationDocRef: string = '8Wsag9DHhyc9gDvw2ZtTli1tXpC2'; // will get used to store the document reference of the destination (channel or privateChat docRef)

  showUsers: boolean = false;
  showChannels: boolean = false;


  constructor(private fb: FormBuilder) {
		this.searchText = this.fb.group({
			search: ['']
		});
	}

  handleSearch() {
    const searchInput = this.searchText.get('search')?.value || '';

    if (searchInput.startsWith('@')) {
        this.showUsers = true;
        this.showChannels = false;
        this.searchService.onUserSearch(searchInput.slice(1)); // Suche ohne das '@'-Zeichen
    } else if (searchInput.startsWith('#')) {
        this.showUsers = false;
        this.showChannels = true;
        this.searchService.onChannelSearch(searchInput.slice(1)); // Suche ohne das '#'-Zeichen
    } else {
        this.showUsers = false;
        this.showChannels = false;
        // Optional: Hier können Sie eine Standardaktion definieren, wenn die Eingabe nicht mit @ oder # beginnt.
    }

    console.log('Search text received by searchService:', searchInput);
}

handleClickOnMember(userId: string) {

  this.selectedPrivateChatReciver = userId;
  this.destinationCollection = 'privateChats';
  console.log('Selected private chat reciver: ', this.selectedPrivateChatReciver);
  console.log('Destination collection: ', this.destinationCollection);
}

handleClickOnChannel(channelId: string) {

  this.selectedPrivateChatReciver = channelId;
  this.destinationCollection = 'channels';
  console.log('Selected channel: ', this.selectedPrivateChatReciver);
  console.log('Destination collection: ', this.destinationCollection);
}









}
