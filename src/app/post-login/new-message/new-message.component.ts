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
  selectedPrivateChatReciver: string = 'BmQs1SSKGoQ0ucvvEUKwM72Bm8K2';  // will get used to store the id of the selected private chat reciver
  destinationCollection: string = 'privateChats'; // will get used to store the collection name of the destination (channels or privateChats)
  destinationDocRef: string = '8Wsag9DHhyc9gDvw2ZtTli1tXpC2'; // will get used to store the document reference of the destination (channel or privateChat docRef)

  constructor(private fb: FormBuilder) {
		this.searchText = this.fb.group({
			search: ['']
		});
	}

/**
 * Executes when the search input changes.
 * Retrieves the current search value from the form and
 * notifies the SearchService with the updated search text.
 */
onSearch() {
  this.searchService.searchText = this.searchText.get('search')?.value;
  console.log('Searchtext recived by searchService',this.searchService.searchText);
}











}
