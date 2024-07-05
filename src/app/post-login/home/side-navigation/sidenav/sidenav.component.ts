import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { PrivateMessageListComponent } from './private-message-list/private-message-list.component';

/**
 * The SidenavComponent provides navigation functionality for the sidebar.
 */

@Component({
	selector: 'app-sidenav',
	standalone: true,
	templateUrl: './sidenav.component.html',
	styleUrl: './sidenav.component.scss',
	imports: [
		ChannelListComponent,
		PrivateMessageListComponent,
		CommonModule,
		RouterModule,
	],
})
export class SidenavComponent {
	@Output() messageEvent = new EventEmitter<object>();

	@Input() isCreateChannelVisible: boolean = false;
	@Output() createChannelVisibilityChange = new EventEmitter<boolean>();

	constructor(private router: Router) {}

	chanListExpanded: boolean = false;
	privateMsgListExpanded: boolean = false;

	// Default icon sources
	downArrowClosed = 'assets/img/icons/arrow_drop_down_closed_black.png';
	downArrowOpened = 'assets/img/icons/arrow_drop_down_open_black.png';
	workspace = 'assets/img/icons/workspaces_black.png';
	accountCircle = 'assets/img/icons/account_circle_black.png';
	addCircle = 'assets/img/icons/add_circle_black.png';
	add = 'assets/img/icons/add_black.png';
  editSquare ='assets/img/icons/edit_square_black.png';

	// Hover icon sources
	downArrowClosedHover = 'assets/img/icons/arrow_drop_down_closed_blue.png';
	downArrowOpenedHover = 'assets/img/icons/arrow_drop_down_open_blue.png';
	workspaceHover = 'assets/img/icons/workspaces_blue.png';
	accountCircleHover = 'assets/img/icons/account_circle_blue.png';
	addCircleHover = 'assets/img/icons/add_circle_blue.png';
	addHover = 'assets/img/icons/add_blue.png';
  editSquareHover ='assets/img/icons/edit_square_blue.png';

	// current Icon Source
	currentIconSourceDownArrowChannels = this.downArrowClosed;
	currentIconSourceDownArrowPrivateMessages = this.downArrowClosed;
	currentIconSourceWorkspace = this.workspace;
	currentIconSourceAccountCircle = this.accountCircle;
	currentIconSourceAddCircle = this.addCircle;
	currentIconSourceAdd = this.add;
  currentIconSourceEditSquare = this.editSquare;

	isMouseOverChannels = false;
	isMouseOverPrivateMessages = false;
	isMouseOveraddChannelFromList = false;
	isMouseOverAddChannelFromHeadline = false;
  isMouseOverEditSquare = false;
	/**
	 * Toggles the expansion state of the channel list.
	 */
	toggleChannels() {
		this.chanListExpanded = !this.chanListExpanded;
		this.updateIcons();
	}

	/**
	 * Toggles the expansion state of the private message list.
	 */

	togglePrivateMessages() {
		this.privateMsgListExpanded = !this.privateMsgListExpanded;
		this.updateIcons();
	}

	/**
	 * Handles the mouse over event for the sideNav icons.
	 * Changes the icon source based on the provided image name.
	 * @param imgName - The name of the image being hovered over.
	 */
	onMouseOver(imgName: string): void {
		switch (imgName) {
			case 'channels':
				this.isMouseOverChannels = true;
				break;
			case 'privateMessages':
				this.isMouseOverPrivateMessages = true;
				break;
			case 'addChannelFromList':
				this.isMouseOveraddChannelFromList = true;
				break;
			case 'addChannelFromHeadline':
				this.isMouseOverAddChannelFromHeadline = true;
				break;
        case 'editSquare':
          this.isMouseOverEditSquare = true;
          break;
		}
		this.updateIcons();
	}

	/**
	 * Handles the mouse out event for the specified image.
	 * @param imgName - The name of the image.
	 */
	onMouseOut(imgName: string): void {
		switch (imgName) {
			case 'channels':
				this.isMouseOverChannels = false;
				break;
			case 'privateMessages':
				this.isMouseOverPrivateMessages = false;
				break;
			case 'addChannelFromList':
				this.isMouseOveraddChannelFromList = false;
				break;
			case 'addChannelFromHeadline':
				this.isMouseOverAddChannelFromHeadline = false;
				break;
        case 'editSquare':
          this.isMouseOverEditSquare = false;
          break;
		}
		this.updateIcons();
	}

	/**
	 * Updates the current icon sources based on the state of the menu and mouse hover.
	 */
	updateIcons(): void {
		if (this.isMouseOverChannels) {
			this.currentIconSourceDownArrowChannels = this.chanListExpanded
				? this.downArrowOpenedHover
				: this.downArrowClosedHover;
			this.currentIconSourceWorkspace = this.workspaceHover;
		} else {
			this.currentIconSourceDownArrowChannels = this.chanListExpanded
				? this.downArrowOpened
				: this.downArrowClosed;
			this.currentIconSourceWorkspace = this.workspace;
		}
		if (this.isMouseOverPrivateMessages) {
			this.currentIconSourceDownArrowPrivateMessages = this
				.privateMsgListExpanded
				? this.downArrowOpenedHover
				: this.downArrowClosedHover;
			this.currentIconSourceAccountCircle = this.accountCircleHover;
		} else {
			this.currentIconSourceDownArrowPrivateMessages = this
				.privateMsgListExpanded
				? this.downArrowOpened
				: this.downArrowClosed;
			this.currentIconSourceAccountCircle = this.accountCircle;
		}
		if (this.isMouseOveraddChannelFromList) {
			this.currentIconSourceAddCircle = this.addCircleHover;
		} else {
			this.currentIconSourceAddCircle = this.addCircle;
		}
		if (this.isMouseOverAddChannelFromHeadline) {
			this.currentIconSourceAdd = this.addHover;
		} else {
			this.currentIconSourceAdd = this.add;
		}
    if (this.isMouseOverEditSquare) {
			this.currentIconSourceEditSquare = this.editSquareHover;
		} else {
			this.currentIconSourceEditSquare = this.editSquare;
		}
    
	}

	toggleCreateChannelVisibility() {
		this.isCreateChannelVisible = !this.isCreateChannelVisible;
		this.createChannelVisibilityChange.emit(this.isCreateChannelVisible);
	}
}
