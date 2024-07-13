import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.scss'
})
export class ChatHistoryComponent {

  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);

  // Edit message menu
  editMsgMenu: boolean = false;

  // Default icon sources
  moreVert = 'assets/img/icons/more_vert_black.png';
  comment = 'assets/img/icons/comment_black.png';
  addReaction = 'assets/img/icons/add_reaction_black.png';
  // Hover icon sources
  moreVertHover = 'assets/img/icons/more_vert_blue.png';
  commentHover = 'assets/img/icons/comment_blue.png';
  addReactionHover = 'assets/img/icons/add_reaction_blue.png';
  // current Icon Source
  currentIconSourceMoreVert = this.moreVert;
  currentIconSourceComment = this.comment;
  currentIconSourceAddReaction = this.addReaction;


  constructor() { }

  openEditMsgMenu() {
    this.editMsgMenu = !this.editMsgMenu;
    console.log('openEditMsgMenu', this.editMsgMenu);
  }

  handleClickOnAnswers() {
    console.log('handleClickOnAnsers');
    this.communicationService.toggleThreadVisibility(true);
    // thread present? -> show thread
    // else -> create thread
    // subcribe to the thread
  }

  onMouseOver(imgName: string) : void {
    switch (imgName) {
      case 'moreVert':
        this.currentIconSourceMoreVert = this.moreVertHover;
        break;
      case 'comment':
        this.currentIconSourceComment = this.commentHover;
        break;
      case 'addReaction':
        this.currentIconSourceAddReaction = this.addReactionHover;
        break;
    }
  }

  onMouseOut(imgName: string) : void {
    switch (imgName) {
      case 'moreVert':
        this.currentIconSourceMoreVert = this.moreVert;
        break;
      case 'comment':
        this.currentIconSourceComment = this.comment;
        break;
      case 'addReaction':
        this.currentIconSourceAddReaction = this.addReaction;
        break;
    }
  }
}
