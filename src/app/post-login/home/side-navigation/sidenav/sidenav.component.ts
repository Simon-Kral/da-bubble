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
  imports: [ChannelListComponent, PrivateMessageListComponent, CommonModule, RouterModule],
})
export class SidenavComponent {

  @Output() messageEvent = new EventEmitter<object>();

  @Input() isCreateChannelVisible: boolean = false;
  @Output() createChannelVisibilityChange = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  chanListExpanded: boolean = false;
  privateMsgListExpanded: boolean = false;


  // Default icon sources
  DownArrowClosed = 'assets/img/icons/arrow_drop_down_closed_black.png';
  DownArrowOpened = 'assets/img/icons/arrow_drop_down_open_black.png';
  Workspace = 'assets/img/icons/workspaces_black.png';
  AccountCircle = 'assets/img/icons/account_circle_black.png';
  AddCircle = 'assets/img/icons/add_circle_black.png';

  // Hover icon sources
  DownArrowClosedHover = 'assets/img/icons/arrow_drop_down_closed_blue.png';
  DownArrowOpenedHover = 'assets/img/icons/arrow_drop_down_open_blue.png';
  WorkspaceHover = 'assets/img/icons/workspaces_blue.png';
  AccountCircleHover = 'assets/img/icons/account_circle_blue.png';
  AddCircleHover = 'assets/img/icons/add_circle_blue.png';

  currentIconSourceDownArrowChannels = this.DownArrowClosed;
  currentIconSourceDownArrowPrivateMessages = this.DownArrowClosed;
  currentIconSourceWorkspace = this.Workspace;
  currentIconSourceAccountCircle = this.AccountCircle;
  currentIconSourceAddCircle = this.AddCircle;

  isMouseOverChannels = false;
  isMouseOverPrivateMessages = false;
  isMouseOveraddChannelFromList = false;

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
    }
    this.updateIcons();
  }

  /**
   * Updates the current icon sources based on the state of the menu and mouse hover.
   */
  updateIcons(): void {
    if (this.isMouseOverChannels) {
      this.currentIconSourceDownArrowChannels = this.chanListExpanded ? this.DownArrowOpenedHover : this.DownArrowClosedHover;
      this.currentIconSourceWorkspace = this.WorkspaceHover;
    } else {
      this.currentIconSourceDownArrowChannels = this.chanListExpanded ? this.DownArrowOpened : this.DownArrowClosed;
      this.currentIconSourceWorkspace = this.Workspace;
    }

    if (this.isMouseOverPrivateMessages) {
      this.currentIconSourceDownArrowPrivateMessages = this.privateMsgListExpanded ? this.DownArrowOpenedHover : this.DownArrowClosedHover;
      this.currentIconSourceAccountCircle = this.AccountCircleHover;
    } else {
      this.currentIconSourceDownArrowPrivateMessages = this.privateMsgListExpanded ? this.DownArrowOpened : this.DownArrowClosed;
      this.currentIconSourceAccountCircle = this.AccountCircle;
    }

    if (this.isMouseOveraddChannelFromList) {
      this.currentIconSourceAddCircle = this.AddCircleHover;
    } else {
      this.currentIconSourceAddCircle = this.AddCircle;
    }
  }

    
    toggleCreateChannelVisibility() {
      this.isCreateChannelVisible = !this.isCreateChannelVisible;
      this.createChannelVisibilityChange.emit(this.isCreateChannelVisible);
    }
}