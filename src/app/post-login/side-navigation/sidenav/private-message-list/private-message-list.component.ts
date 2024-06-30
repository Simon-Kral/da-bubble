import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-private-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-message-list.component.html',
  styleUrl: './private-message-list.component.scss'
})
export class PrivateMessageListComponent {



  privateMsgList = [
    { user: 'Hans', avatarUrl: 'assets/img/character-images/character_1.png', onlineStatus: 'online' },
    { user: 'Otto', avatarUrl: 'assets/img/character-images/character_2.png', onlineStatus: 'offline' },
    { user: 'Karl', avatarUrl: 'assets/img/character-images/character_3.png', onlineStatus: 'online' }
  ];

  selectedConversation: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void{
  }

  navigateToPrivateConversation(conversation: string) {
    this.selectedConversation= conversation;
    console.log('Navigating to conversation with', conversation);
  }
}
