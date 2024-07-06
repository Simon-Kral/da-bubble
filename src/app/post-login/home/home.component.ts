import { Component, inject, Input, OnInit } from '@angular/core';
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
import { UserMenuComponent } from './user-menu/user-menu.component';
@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [HeaderComponent, ChannelComponent, SidenavComponent, ThreadComponent, CommonModule, RouterOutlet, CreateNewChannelComponent, PrivateMessageComponent, UserProfileComponent, CurrentUserProfileComponent, UserMenuComponent],
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
	//user menu variables
	isUserMenuVisible: boolean = false;

	//sidenav functions
	toggleSidenav() {
		this.isSidenavVisible = !this.isSidenavVisible;
	}
  /**
   * Toggles the visibility of various components based on the given name.
   * @param name The name of the component to toggle visibility for.
   * @param visible Boolean flag indicating whether to show or hide the component.
   */
  toggleComponentVisibility(name: string, visible: boolean): void {
    switch (name) {
      case 'createChannel':
        this.isCreateChannelVisible = visible;
        break;
      case 'userProfile':
        this.isUserProfileVisible = visible;
        break;
      case 'currentUserProfile':
        this.isCurrentUserProfileVisible = visible;
        break;
      case 'userMenu':
        this.isUserMenuVisible = visible;
        break;
      default:
        console.warn(`Unknown component name: ${name}`);
        break;
    }
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
		case 'userMenu':
			this.isUserMenuVisible = false;
			break;
		  default:
			console.warn(`Unknown popup name: ${name}`);
			break;
		}
	  }
	/**
	 * Handles the mouse over event for the sideNav Controller icons.
	 */
	onMouseOver(): void {
		this.currentIconSourceMenu = this.menuHover;
	}
		
	/**
	* Handles the mouse out event for the sideNav Controller icons.
	*/
	onMouseOut(): void {
		this.currentIconSourceMenu = this.menu;
	}
}

