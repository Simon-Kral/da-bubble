import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from '../channel/channel.component';
import { SidenavComponent } from '../home/side-navigation/sidenav/sidenav.component';
import { ThreadComponent } from '../channel/thread/thread.component';
import { CreateNewChannelComponent } from '../channel/create-channel/create-new-channel/create-new-channel.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { FirebaseService } from './../../services/firebase/firebase.service';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CurrentUserProfileComponent } from './current-user-profile/current-user-profile.component';
@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [HeaderComponent, ChannelComponent, SidenavComponent, ThreadComponent, CommonModule, RouterOutlet, CreateNewChannelComponent, PrivateMessageComponent, UserProfileComponent, CurrentUserProfileComponent],
})
export class HomeComponent implements OnInit {
	authService = inject(AuthService);
	firebaseService = inject(FirebaseService);

	  // Default icon sources
	  menu = '../../assets/img/icons/menu_black.png';
	  // Hover icon sources
	  menuHover = '../../assets/img/icons/menu_blue.png';
	  // current Icon Source
	  currentIconSourceMenu = this.menu;

	constructor() {
		this.authService.checkUserStatus();
		this.firebaseService.getUserChannels();
	}

	ngOnInit(): void {
		this.firebaseService.setCurrentUserAsObjekt();
	}

	//sidenav variables
	isSidenavVisible: boolean = true;
	//create channel variables
	isCreateChannelVisible: boolean = false;
	//user profile variables
	isUserProfileVisible: boolean = false;
	//current user profile variables
	isCurrentUserProfileVisible: boolean = false;

	//sidenav functions
	toggleSidenav() {
		this.isSidenavVisible = !this.isSidenavVisible;
	}
	//create channel functions
	onCreateChannelVisibilityChange(visible: boolean) {
		this.isCreateChannelVisible = visible;
	}

	//user profile functions
	onUserProfileVisibilityChange(visible: boolean) {
		this.isUserProfileVisible = visible;
	}

	//current user profile functions
	onCurrentUserProfileVisibilityChange(visible: boolean) {
		this.isCurrentUserProfileVisible = visible;
	}
	// functions for popup overlay
	preventClose(event: MouseEvent) {
		event.stopPropagation();
	}
	/**
	 * Closes the specified popup overlay.
	 * @param {string} name - The name of the popup to close (e.g.'createChannel' or 'userProfile').
	 */
	closePopupOverlay(name: string) {
		switch (name) {
		  case 'createChannel':
			this.isCreateChannelVisible = false;
			break;
		  case 'userProfile':
			this.isUserProfileVisible = false;
			break;
		  case 'currentUserProfile':
			this.isCurrentUserProfileVisible = false;
			break;
		  default:
			console.warn(`Unknown popup name: ${name}`);
			break;
		}
	  }
	/**
	 * Handles the mouse over event for the sideNav icons.
	 */
	onMouseOver(): void {
		this.currentIconSourceMenu = this.menuHover;
	}
		
	/**
	* Handles the mouse out event for the specified image.
	*/
	onMouseOut(): void {
		this.currentIconSourceMenu = this.menu;
	}
}

