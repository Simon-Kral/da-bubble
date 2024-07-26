import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommunicationService } from '../../../services/communication/communication.service';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss'
})
export class MobileHeaderComponent {

  firebaseService = inject(FirebaseService);
  communicationService = inject(CommunicationService);

  



}
