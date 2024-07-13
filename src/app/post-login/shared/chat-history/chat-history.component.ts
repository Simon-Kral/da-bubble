import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface MsgData {
  text: string;
}


@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  // Edit message variables
  showEditMsgOverlay: boolean = false;
  currentMsgData: MsgData;
  newMsgData: FormGroup;

  constructor(private fb: FormBuilder) {
    this.currentMsgData =  { text: ''}

    this.newMsgData = this.fb.group({
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  openEditMsgMenu() {
    this.editMsgMenu = !this.editMsgMenu;
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

  // edit msg functions

  handleClickOnEditMsg(messageId: string) {
    this.chatService.editMessageId = messageId;
     this.loadMessageText();
    this.showEditMsgOverlay = true;
  }

  async onSubmitEditMsg() {
    this.editMsgMenu = false;
    if (this.newMsgData.valid) {
      const updatedText = this.newMsgData.value.text;
      try {
        await this.chatService.updateMessage(
          updatedText
        );
        console.log('Message text updated successfully');
        this.showEditMsgOverlay = false;
      } catch (error) {
        console.error('Error updating message text:', error);
      }
    }
  }
  handleClickOnCancel() {
    this.showEditMsgOverlay = false;
    this.editMsgMenu = false;
  }

  async loadMessageText() {
    try {
      const text = await this.chatService.getMessage();
      this.currentMsgData = { text: text };
      this.newMsgData.patchValue({ text: text });
    } catch (error) {
      console.error('Error loading message text:', error);
    }
  }
}
