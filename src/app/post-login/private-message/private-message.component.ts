import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ChatInputComponent } from '../shared/chat-input/chat-input.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { PrivateMessageListComponent } from '../home/side-navigation/sidenav/private-message-list/private-message-list.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-private-message',
  standalone: true,
  imports: [ChatInputComponent, CommonModule],
  templateUrl: './private-message.component.html',
  styleUrl: './private-message.component.scss'
})
export class PrivateMessageComponent implements OnInit{
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);

  showPrivateNote: boolean = false;


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.showPrivateNote = params['showPrivateNote'] === 'true';
    });
  }
}