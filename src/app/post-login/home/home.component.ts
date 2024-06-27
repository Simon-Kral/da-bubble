import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { ThreadComponent } from '../thread/thread.component';


@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [HeaderComponent, ChatComponent, SidenavComponent, ThreadComponent]
})
export class HomeComponent {

}
