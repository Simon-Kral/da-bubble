import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from './channel/channel.component';
import { SidenavComponent } from '../home/side-navigation/sidenav/sidenav.component';
import { ThreadComponent } from './channel/thread/thread.component';
import { CreateNewChannelComponent } from './channel/create-channel/create-new-channel/create-new-channel.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { FirebaseService } from './../../services/firebase/firebase.service';
import { ChatService } from '../../services/chat/chat.service';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CurrentUserProfileComponent } from './current-user-profile/current-user-profile.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ChannelDetailsComponent } from './channel/channel-details/channel-details.component';
import { CommunicationService } from '../../services/communication/communication.service';
import { AddMembersToChannelComponent } from './channel/add-members-to-channel/add-members-to-channel.component';
@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [
		HeaderComponent,
		ChannelComponent,
		SidenavComponent,
		ThreadComponent,
		CommonModule,
		RouterOutlet,
		CreateNewChannelComponent,
		PrivateMessageComponent,
		UserProfileComponent,
		CurrentUserProfileComponent,
		UserMenuComponent,
		ChannelDetailsComponent,
		AddMembersToChannelComponent,
	],
})
export class HomeComponent implements OnInit {
	authService = inject(AuthService);
	firebaseService = inject(FirebaseService);
	chatService = inject(ChatService);
	communicationService = inject(CommunicationService);

	// Default icon sources
	menu = '../../assets/img/icons/menu_black.png';
	// Hover icon sources
	menuHover = '../../assets/img/icons/menu_blue.png';
	// current Icon Source
	currentIconSourceMenu = this.menu;

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
	//thread variables
	isThreadVisible: boolean = false;

	//Dragan: channel details variables
	isChannelDetailsVisible: boolean = false;
	//Dragan: add members to channel variables
	isAddMembersToChannelVisible: boolean = false;

	ngOnInit(): void {
		this.firebaseService.getCurrentUserId();
		this.firebaseService.setCurrentUserAsObjekt(); // to-do remove after developement is finished
		this.communicationService.isCurrentUserProfileVisible$.subscribe(
			(visible) => {
				this.isCurrentUserProfileVisible = visible;
			}
		);
		this.communicationService.isUserProfileVisible$.subscribe((visible) => {
			this.isUserProfileVisible = visible;
		});

		// Dragan: I have added this subscription to the channel details visibility.
		this.communicationService.isChannelDetailsVisible$.subscribe((visible) => {
			this.isChannelDetailsVisible = visible;
		});

		// Dragan: I have added this subscription to the add members to channel visibility.
		this.communicationService.isAddMembersToChannelVisible$.subscribe((visible) => {
			this.isAddMembersToChannelVisible = visible;
		});
	}

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
			case 'channelDetails':
				this.isChannelDetailsVisible = visible;
				break;
			case 'addMembersToChannel':
				this.isAddMembersToChannelVisible = visible;
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
			case 'channelDetails':
				this.isChannelDetailsVisible = false;
				break;
			case 'addMembersToChannel':
				this.isAddMembersToChannelVisible = false;
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
