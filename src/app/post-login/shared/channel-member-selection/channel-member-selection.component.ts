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
  
  
  
  constructor() {}

  handleClickOnMember(userId: string) {
    console.log('Member ID: ', userId);
    this.searchService.pushSelectedUserToArray(userId);
  }

}
