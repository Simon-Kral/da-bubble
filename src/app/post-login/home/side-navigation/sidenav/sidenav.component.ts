import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { PrivateMessageListComponent } from './private-message-list/private-message-list.component';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    imports: [ChannelListComponent, PrivateMessageListComponent, CommonModule]
})
export class SidenavComponent {

  constructor(private router: Router) { }

  chanListExpanded: boolean = false;
  privateMsgListExpanded: boolean = false;

  toggleChannels() {
    this.chanListExpanded = !this.chanListExpanded;
  }

  togglePrivateMessages() {
    this.privateMsgListExpanded = !this.privateMsgListExpanded;
  }

  navigateToNewMessage() {
    this.router.navigate(['/home/new-message']);
  }

}
