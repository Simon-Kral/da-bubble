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

   // Default icon sources
	close = '../../../../assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = '../../../../assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;

  handleClickOnChannel(chanId: string) {
    this.searchService.selectedChannel = chanId
    this.searchService.channelSearchActive = false;
    console.log('selected chan id:',this.searchService.selectedChannel);
  }

  handleClickOnClose() {
    this.searchService.channelSearchActive = false;
  }

  /**
	 * Handles the mouse over event for the sideNav icons.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
  }
}
