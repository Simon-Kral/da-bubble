import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Firestore, collection, onSnapshot, orderBy, query, addDoc,  doc, updateDoc } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';

interface UserData {
  name: string;
  email: string;
}

@Component({
  selector: 'app-current-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './current-user-profile.component.html',
  styleUrl: './current-user-profile.component.scss'
})
export class CurrentUserProfileComponent implements OnInit{
  firestore: Firestore = inject(Firestore);
  firebaseService = inject(FirebaseService);

  @Input() isCurrentUserProfileVisible: boolean = false;
  @Output() currentUserProfileVisibilityChange = new EventEmitter<boolean>();

  isEditProfileVisible: boolean = false;
  isEditAvatarVisible: boolean = false;

  newUserData: FormGroup;
  currentUserData: UserData;

  constructor(private fb: FormBuilder) {
    this.newUserData = this.fb.group({
      name: [''],
      email: ['']
    });
    this.currentUserData = {
      name: this.firebaseService.getUserDisplayName(this.firebaseService.currentUserId),
      email: this.firebaseService.getUserEmail(this.firebaseService.currentUserId)
    };
  }

  ngOnInit() {
    this.newUserData.setValue({
      name: this.currentUserData.name,
      email: this.currentUserData.email
    });
  }


  saveProfile() {
    const updates: Partial<UserData> = this.newUserData.value;
    this.firebaseService.updateUserProfile(updates)
      .then(() => {
        console.log('User profile updated successfully');
        this.toggleUserProfile(false);
      })
      .catch(error => {
        console.error('Error updating user profile: ', error);
      });
  }

  onCancel(): void {
    this.newUserData.reset(this.currentUserData);
    this.toggleEditProfile();
  }

toggleUserProfile(visible: boolean) {
  this.currentUserProfileVisibilityChange.emit(visible);
  }

toggleEditProfile() {
  this.isEditProfileVisible = !this.isEditProfileVisible;
}

toggleEditAvatar() {
  this.isEditAvatarVisible = !this.isEditAvatarVisible;
}

}
