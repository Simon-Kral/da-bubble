import { ChatService } from './../../../services/chat/chat.service';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
	authService = inject(AuthService);
	router = inject(Router);
	chatService = inject(ChatService);
	firebaseService = inject(FirebaseService);
	searchService = inject(SearchService);

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
			this.isFocusActive = false;
			this.showUsers = true;
			this.showChannels = false;
			this.searchService.onUserSearch(searchInput.slice(1)); // Suche ohne das '@'-Zeichen
		} else if (searchInput.startsWith('#')) {
			this.isFocusActive = false;
			this.showUsers = false;
			this.showChannels = true;
			this.searchService.onChannelSearch(searchInput.slice(1)); // Suche ohne das '#'-Zeichen
		} else {
			this.showUsers = false;
			this.showChannels = false;
			this.isFocusActive = true;
			// Optional: Hier können Sie eine Standardaktion definieren, wenn die Eingabe nicht mit @ oder # beginnt.
		}
	
		console.log('Search text received by searchService:', searchInput);
	}

	handleClickOnMember(userId: string) {
		this.chatService.startNewPrivateChat(this.firebaseService.currentUserId, userId);
	}
	  
	  handleClickOnChannel(channelId: string) {
		
	  }	

	//user profile functions
	toggleUserProfile(visible: boolean) {
		this.userProfileToggle.emit(visible);
	}

	handleFocus() {
		this.isFocusActive = !this.isFocusActive;
	}
}
