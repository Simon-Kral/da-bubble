import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { ThreadComponent } from '../thread/thread.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ChatComponent, ThreadComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
