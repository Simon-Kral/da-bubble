import { Component } from '@angular/core';
import { last } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  users = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'Ä',
      phone: '1234567890',
      profileImg: 'assets/img/character-images/character_1.png'
    },
    {
      id: 2,
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'B',
      phone: '9876543210',
      profileImg: 'assets/img/character-images/character_2.png'
    },
    {
      id: 3,
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'C',
      phone: '5555555555',
      profileImg: 'assets/img/character-images/character_3.png'
    },
  ]
}
