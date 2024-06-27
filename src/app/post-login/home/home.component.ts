import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChannelComponent } from '../channel/channel.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ThreadComponent } from '../thread/thread.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HeaderComponent, ChannelComponent, SidenavComponent, ThreadComponent],
})
export class HomeComponent {}
