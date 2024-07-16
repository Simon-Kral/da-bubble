import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
export class ChatHistoryComponent implements OnInit, OnDestroy {

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute ) {
    this.currentMsgData =  { text: ''}

    this.newMsgData = this.fb.group({
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

    this.route.url.subscribe(urlSegments => {
      const mainCollection = urlSegments[0]?.path; // 'channels' or 'privateChats' or 'privateNotes'
      const id = urlSegments[1]?.path;             // id aka docRef of the channel or privateChat or privateNote
      this.chatService.mainCollection = mainCollection;  //sets the main collection
      this.chatService.docRef = id;                     //sets the docRef
      console.log('Chat initialisiert', this.chatService.mainCollection, this.chatService.docRef);
  
    });
  }

  ngOnInit(): void {
    this.chatService.subscribeAllLists();
  }

  ngOnDestroy(): void {
    this.chatService.unsubscribeAllLists();
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
 /**
 * Handles the click event for editing a message.
 * Sets the ID of the message to be edited, loads the message text, and shows the edit message overlay.
 *
 * @param {string} messageId - The ID of the message to be edited.
 */
  handleClickOnEditMsg(messageId: string) {
    this.chatService.editMessageId = messageId;  // set the id of the message to be edited into the chatService
     this.loadMessageText();                     // load the text of the message to be edited
    this.showEditMsgOverlay = true;             // show the edit message overlay
  }

  /**
  * Handles the submission of the edited message.
   * Closes the edit message menu, validates the new message text, updates the message, and closes the edit message overlay.
  *
  * @returns {Promise<void>} A promise that resolves when the message text has been successfully updated.
  */
  async onSubmitEditMsg() {
    this.editMsgMenu = false;                         // close the edit message menu
    if (this.newMsgData.valid) {                      // check if the new message text is valid
      const updatedText = this.newMsgData.value.text; // get the new message text
      try {
        await this.chatService.updateMessage(         // update the message text
          updatedText
        );
        console.log('Message text updated successfully');
        this.showEditMsgOverlay = false;              // close the edit message overlay
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
    this.editMsgMenu = false;
  }
  
  /**
  * Loads the text of the message to be edited.
  * Fetches the message text from the chat service and sets it in the current message data and form.
  * @returns {Promise<void>} A promise that resolves when the message text is loaded and set.
  */
  async loadMessageText() {
    try {
      const text = await this.chatService.getMessage();  // get the text of the message to be edited
      this.currentMsgData = { text: text };             // set the text of the message to be edited
      this.newMsgData.patchValue({ text: text });       // set the text of the message to be edited in the form
    } catch (error) {
      console.error('Error loading message text:', error);
    }
  }
}
