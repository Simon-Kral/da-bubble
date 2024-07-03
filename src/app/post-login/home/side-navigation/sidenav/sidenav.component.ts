import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  imports: [ChannelListComponent, PrivateMessageListComponent, CommonModule],
})
export class SidenavComponent {

  @Output() messageEvent = new EventEmitter<object>();

  @Input() isCreateChannelVisible: boolean = false;
  @Output() createChannelVisibilityChange = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  chanListExpanded: boolean = false;
  privateMsgListExpanded: boolean = false;


  // Default icon sources
  iconSourceDownArrowClosed = 'assets/img/icons/arrow_drop_down_closed_black.png';
  iconSourceDownArrowOpened = 'assets/img/icons/arrow_drop_down_open_black.png';
  iconSourceWorkspace = 'assets/img/icons/workspaces_black.png';
  iconSourceAccountCircle = 'assets/img/icons/account_circle_black.png';

  // Hover icon sources
  iconSourceDownArrowClosedHover = 'assets/img/icons/arrow_drop_down_closed_blue.png';
  iconSourceDownArrowOpenedHover = 'assets/img/icons/arrow_drop_down_open_blue.png';
  iconSourceWorkspaceHover = 'assets/img/icons/workspaces_blue.png';
  iconSourceAccountCircleHover = 'assets/img/icons/account_circle_blue.png';

  currentIconSourceDownArrowChannels = this.iconSourceDownArrowClosed;
  currentIconSourceDownArrowPrivateMessages = this.iconSourceDownArrowClosed;
  currentIconSourceWorkspace = this.iconSourceWorkspace;
  currentIconSourceAccountCircle = this.iconSourceAccountCircle;

  isMouseOverChannels = false;
  isMouseOverPrivateMessages = false;

  /**
   * Toggles the expansion state of the channel list.
   */
  toggleChannels() {
    this.chanListExpanded = !this.chanListExpanded;
    this.updateIcons();
    if (this.chanListExpanded) {
      // Implement logic to fetch channels and subscribe to channel list via Service
    } else {
      // Implement logic to unsubscribe from channel list via Service
    }
  }

  /**
   * Toggles the expansion state of the private message list.
   */

  togglePrivateMessages() {
    this.privateMsgListExpanded = !this.privateMsgListExpanded;
    if (this.privateMsgListExpanded) {
      //implement logic to fetch private messages and subscribe to private message list via Service
    } else {
      //implement logic to unsubscribe from private message list via Service
    }
  }

  /**
   * Navigates to the 'new message' page.
   */

  navigateToNewMessage() {
    this.router.navigate(['/home/new-message']);
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
    }
    this.updateIcons();
  }

  /**
   * Updates the current icon sources based on the state of the menu and mouse hover.
   */
  updateIcons(): void {
    if (this.isMouseOverChannels) {
      this.currentIconSourceDownArrowChannels = this.chanListExpanded ? this.iconSourceDownArrowOpenedHover : this.iconSourceDownArrowClosedHover;
      this.currentIconSourceWorkspace = this.iconSourceWorkspaceHover;
    } else {
      this.currentIconSourceDownArrowChannels = this.chanListExpanded ? this.iconSourceDownArrowOpened : this.iconSourceDownArrowClosed;
      this.currentIconSourceWorkspace = this.iconSourceWorkspace;
    }

    if (this.isMouseOverPrivateMessages) {
      this.currentIconSourceAccountCircle = this.iconSourceAccountCircleHover;
    } else {
      this.currentIconSourceAccountCircle = this.iconSourceAccountCircle;
    }
  }

    
    toggleCreateChannelVisibility() {
      this.isCreateChannelVisible = !this.isCreateChannelVisible;
      this.createChannelVisibilityChange.emit(this.isCreateChannelVisible);
    }
}