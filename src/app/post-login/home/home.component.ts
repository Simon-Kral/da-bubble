import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { ThreadComponent } from '../thread/thread.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule,HeaderComponent, ChatComponent, SidenavComponent, ThreadComponent]
})
export class HomeComponent {
 //sidenav
 isSidenavVisible: boolean = true;

 toggleSidenav() {
    console.log("toggleSidebar");
    this.isSidenavVisible = !this.isSidenavVisible;
 }
 
 
}
