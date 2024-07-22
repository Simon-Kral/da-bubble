import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../../../services/thread/thread.service';
interface MsgData {
  text: string;
}
@Component({
  selector: 'app-thread-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './thread-history.component.html',
  styleUrl: './thread-history.component.scss'
})
export class ThreadHistoryComponent implements OnInit, OnDestroy {
  firebaseService = inject(FirebaseService);
  chatService = inject(ChatService);
  communicationService = inject(CommunicationService);
  threadService = inject(ThreadService);

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

    constructor(private fb: FormBuilder, private route: ActivatedRoute ) {
      this.currentMsgData =  { text: ''}
  
      this.newMsgData = this.fb.group({
        text: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
        ]),
      });
  
    }

  ngOnInit(): void {
    this.threadService.subscribeAllLists();
  }

  ngOnDestroy(): void {
    this.threadService.unsubscribeAllLists();
  }

  toggleMsgMenu() {
    this.communicationService.isMsgMenuThreadVisible = !this.communicationService.isMsgMenuThreadVisible;
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
 /**
 * Handles the click event for editing a message.
 * Sets the ID of the message to be edited, loads the message text, and shows the edit message overlay.
 *
 * @param {string} messageAnswerId - The ID of the message to be edited.
 */
  handleClickOnEditMsg(messageAnswerId: string, messageId: string) {
    this.toggleMsgMenu();
    this.threadService.editMessageAnswerId = messageAnswerId;  // set the id of the message to be edited into the chatService
    this.threadService.editMessageId = messageId;
    this.loadMessageText();                     // load the text of the message to be edited
    this.showEditMsgOverlay = true;             // show the edit message overlay
  }

  // delete msg functions
  handleClickOnDeleteMsg(messageId:string, messageAnswerId: string) {
    this.toggleMsgMenu();
    this.communicationService.isDeleteThreadMsgDialogVisible = true;
    this.threadService.chatService.editMessageId = messageId;
    this.threadService.editMessageAnswerId = messageAnswerId;  
  }

  handleClickOnCancelDeleteMsg() {
    this.communicationService.isDeleteThreadMsgDialogVisible = false;
    this.threadService.editMessageAnswerId = '';  
  }

  handleClickOnConfirmDeleteMsg() {
    this.communicationService.isDeleteThreadMsgDialogVisible = false;
    this.threadService.deleteMessageAnswer();
     // decrement the message count in msg document
  }

  /**
  * Handles the submission of the edited message.
  * Closes the edit message menu, validates the new message text, updates the message, and closes the edit message overlay.
  * Updates the initial message 
  * @returns {Promise<void>} A promise that resolves when the message text has been successfully updated.
  */
  async onSubmitEditMsgAnswer() {
    if (this.newMsgData.valid) {                     
      const updatedText = this.newMsgData.value.text;
      try {
        await this.threadService.updateMessageAnswer(       
          updatedText
        );
        console.log('Message text updated successfully');
        if (this.threadService.editMessageId) { 
          await this.threadService.updateInitialMessage(updatedText);
          console.log('Thread message text updated successfully');
        }
        this.showEditMsgOverlay = false;              
      } catch (error) {
        console.error('Error updating message text:', error);
      }
    }
  }

  /**
  * Handles the cancel action for editing a message.
  * Closes the edit message overlay and the edit message menu.
  */
  handleClickOnCancel() {
    this.showEditMsgOverlay = false;
  }
  
  /**
  * Loads the text of the message to be edited.
  * Fetches the message text from the chat service and sets it in the current message data and form.
  * @returns {Promise<void>} A promise that resolves when the message text is loaded and set.
  */
  async loadMessageText() {
    try {
      const text = await this.threadService.getMessageAnswer();  // get the text of the message to be edited
      this.currentMsgData = { text: text };             // set the text of the message to be edited
      this.newMsgData.patchValue({ text: text });       // set the text of the message to be edited in the form
    } catch (error) {
      console.error('Error loading message text:', error);
    }
  }
}
