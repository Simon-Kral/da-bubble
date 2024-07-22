import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-member-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-member-selection.component.html',
  styleUrl: './channel-member-selection.component.scss'
})
export class ChannelMemberSelectionComponent {
  firebaseService = inject(FirebaseService);
  searchService = inject(SearchService);
  
  // Default icon sources
	close = '../../../../assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = '../../../../assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;
  
  
  constructor() {}

/**
 * Handles the action when a user member is clicked.
 * This function adds the clicked user ID to the selected users array managed by the `searchService`.
 * @param {string} userId - The ID of the user who was clicked.
 * @returns {void}
 */
  handleClickOnMember(userId: string) {
    this.searchService.pushSelectedUserToArray(userId);
  }

/**
 * Handles the action when the close button is clicked in the member search interface.
 * This function deactivates the member search mode by setting `memberSearchActive` to false 
 * in the `searchService`, effectively closing or hiding the search results.
 * @returns {void}
 */
  handleClickOnClose() {
    this.searchService.memberSearchActive = false;
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
