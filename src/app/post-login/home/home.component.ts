import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from '../channel/channel.component';
import { SidenavComponent } from '../home/side-navigation/sidenav/sidenav.component';
import { ThreadComponent } from '../channel/thread/thread.component';
import { CreateNewChannelComponent } from '../channel/create-new-channel/create-new-channel.component';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './../../services/firebase/firebase.service';


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
  ],
})
export class HomeComponent {

  firebaseService = inject(FirebaseService);

  constructor() {
    //this.firebaseService.getUserChannels();
    this.firebaseService.getSpecificUser('BDMyD47mKgDw0c24Hdei');
  }

  //sidenav variables
  isSidenavVisible: boolean = true;
  //create channel
  isCreateChannelVisible: boolean = false;

  //sidenav functions
  toggleSidenav() {
    this.isSidenavVisible = !this.isSidenavVisible;
  }
  //create channel functions
  onCreateChannelVisibilityChange(visible: boolean) {
    this.isCreateChannelVisible = visible;
  }
}
