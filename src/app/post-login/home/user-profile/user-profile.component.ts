import { Component, inject } from '@angular/core';
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


// To-Do: Implement the function to show the data of the user
  showDataOfUser: string ='jHPIWLbP5Jcupmn6MQAT'; 

}
