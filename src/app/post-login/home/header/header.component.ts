import { ThreadService } from './../../../services/thread/thread.service';
import { ChatService } from './../../../services/chat/chat.service';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router, RouterLink, TitleStrategy } from '@angular/router';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  chatService = inject(ChatService);
  firebaseService = inject(FirebaseService);
  searchService = inject(SearchService);
  threadService = inject(ThreadService);

  searchText: FormGroup;
  showUsers: boolean = false;
  showChannels: boolean = false;
  //user profile
  @Output() userProfileToggle = new EventEmitter<boolean>();
  isFocusActive: boolean = false;

  constructor(private fb: FormBuilder) {
    this.searchText = this.fb.group({
      search: [''],
    });
  }

  ngOnInit() {}

  handleSearch() {
    const searchInput = this.searchText.get('search')?.value || '';
    if (searchInput.startsWith('@')) {
      this.userSearchActive(searchInput);
    } else if (searchInput.startsWith('#')) {
      this.channelSearchActive(searchInput);
    } else {
      this.showAllUsersAndChannels();
      this.searchService.searchSesificMessage(searchInput);
    }
  }

  /**
   * Activates user search and performs a search based on the provided input.
   * @param searchInput - The search input string.
   */
  userSearchActive(searchInput: string) {
    this.isFocusActive = false;
    this.showUsers = true;
    this.showChannels = false;
    this.searchService.onUserSearch(searchInput.slice(1)); // Suche ohne das '@'-Zeichen
  }

  /**
   * Activates the channel search and performs a search based on the provided input.
   * @param searchInput - The search input string.
   */
  channelSearchActive(searchInput: string) {
    this.isFocusActive = false;
    this.showUsers = false;
    this.showChannels = true;
    this.searchService.onChannelSearch(searchInput.slice(1)); // Suche ohne das '#'-Zeichen
  }

  /**
   * Shows all users and channels.
   * Hides the users and channels, sets the focus to active, and unsubscribes from channel and user search.
   */
  showAllUsersAndChannels() {
    this.showUsers = false;
    this.showChannels = false;
    this.isFocusActive = true;
    this.searchService.unSubscribeOnChannelSearch();
    this.searchService.unSubscribeOnUserSearch();
  }

  handleClickOnMember(userId: string) {
    this.searchText.reset();
    this.isFocusActive = false;
    this.showUsers = false;
    this.showChannels = false;
    this.searchService.handleClickOnUserAndUnSub(userId);
  }

  //user profile functions
  toggleUserProfile(visible: boolean) {
    this.userProfileToggle.emit(visible);
  }

  handleToggleFocus() {
    if (this.isFocusActive) {
      this.searchService.unSubscribeOnChannelSearch();
      this.searchService.unSubscribeOnUserSearch();
    }
    this.isFocusActive = !this.isFocusActive;
	this.searchService.searchSpesificChannelMessageResault = [];
	this.searchService.searchSpesificThreadMessageResaults = [];
	this.searchText.reset();
  }

  /**
   * Handles the click event on a channel.
   * @param channelId - The ID of the channel that was clicked.
   */
  handleClickOnChannel(channelId: string) {
    this.searchText.reset();
    this.isFocusActive = false;
    //unsubscribe from channel search
    this.searchService.handleClickOnChannelAndUnSub(channelId);
  }

  noMessageSearchResult() {
	return !this.searchService.searchSpesificChannelMessageResault.length || !this.searchService.searchSpesificChannelMessageResault.length;
  }
}
