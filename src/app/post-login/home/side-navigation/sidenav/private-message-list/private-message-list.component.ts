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
    { user: 'Hans', avatarUrl: 'assets/img/character-images/character_1.png', onlineStatus: 'online', id: '1' },
    { user: 'Otto', avatarUrl: 'assets/img/character-images/character_2.png', onlineStatus: 'offline', id: '2'},
    { user: 'Karl', avatarUrl: 'assets/img/character-images/character_3.png', onlineStatus: 'online', id: '3' }
  ];

  currentUser = [
    { user: 'Sofia', avatarUrl: 'assets/img/character-images/character_3.png', onlineStatus: 'online', id: '4'}
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
