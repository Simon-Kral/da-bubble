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

@Component({
	selector: 'app-home',
	standalone: true,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	imports: [HeaderComponent, ChannelComponent, SidenavComponent, ThreadComponent, CommonModule, RouterOutlet, CreateNewChannelComponent, PrivateMessageComponent],
})
export class HomeComponent implements OnInit {
	authService = inject(AuthService);
	firebaseService = inject(FirebaseService);

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


	//sidenav functions
	toggleSidenav() {
		this.isSidenavVisible = !this.isSidenavVisible;
	}
	//create channel functions
	onCreateChannelVisibilityChange(visible: boolean) {
		this.isCreateChannelVisible = visible;
	}
	preventClose(event: MouseEvent) {
		event.stopPropagation();
	}
	  closeCreateChannel() {
		this.isCreateChannelVisible = false;
	  }
}

