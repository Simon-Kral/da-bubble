import { Component, inject } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { ChatService } from '../../../../services/chat/chat.service';
import { FirebaseService } from '../../../../services/firebase/firebase.service';
@Component({
  selector: 'app-channel-selection',
  standalone: true,
  imports: [],
  templateUrl: './channel-selection.component.html',
  styleUrl: './channel-selection.component.scss'
})
export class ChannelSelectionComponent {

  searchService = inject(SearchService);
  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  
  channelSearchActive: boolean = false;

  handleClickOnChannel(chanId: string) {


  }
}
