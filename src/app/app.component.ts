import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './post-login/home/home.component';
import { SidenavComponent } from './post-login/home/side-navigation/sidenav/sidenav.component';
import { ChannelListComponent } from './post-login/home/side-navigation/sidenav/channel-list/channel-list.component';
import { PrivateMessageListComponent } from './post-login/home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { NewMessageComponent } from './post-login/new-message/new-message.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, SidenavComponent, NewMessageComponent, ChannelListComponent, PrivateMessageListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'da-bubble';
}
