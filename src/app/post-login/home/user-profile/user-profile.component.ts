import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  firebaseService = inject(FirebaseService);

 
  @Input() isUserProfileVisible: boolean = false;
  @Output() userProfileVisibilityChange = new EventEmitter<boolean>();

// To-Do: Implement the function to show the data of the user
  showDataOfUser: string ='jHPIWLbP5Jcupmn6MQAT'; 

}
