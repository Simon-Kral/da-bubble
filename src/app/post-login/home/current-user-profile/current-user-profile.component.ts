import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-current-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-user-profile.component.html',
  styleUrl: './current-user-profile.component.scss'
})
export class CurrentUserProfileComponent {

firebaseService = inject(FirebaseService);
@Input() isCurrentUserProfileVisible: boolean = false;
@Output() currentUserProfileVisibilityChange = new EventEmitter<boolean>();


}
