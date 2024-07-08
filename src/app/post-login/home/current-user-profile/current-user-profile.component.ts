import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { Firestore, collection, onSnapshot, orderBy, query, addDoc,  doc, updateDoc } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';
import { AuthService } from '../../../services/authentication/auth.service';
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
  authService = inject(AuthService);

  @Input() isCurrentUserProfileVisible: boolean = false;
  @Output() currentUserProfileVisibilityChange = new EventEmitter<boolean>();

  isEditProfileVisible: boolean = false;
  isEditAvatarVisible: boolean = false;

  newAvatarPath: string = '';
  newAvatarChosen: boolean = false;

  // Default icon sources
  close = 'assets/img/icons/close_black.png';
  // Hover icon sources
  closeHover = 'assets/img/icons/close_blue.png';
  // current Icon Source
  currentIconSourceClose = this.close;

  avatarList: Array<{ id: number, path: string }> = [
    { id: 0, path: '/assets/img/character-images/character_1.png' },
    { id: 1, path: '/assets/img/character-images/character_2.png' },
    { id: 2, path: '/assets/img/character-images/character_3.png' },
    { id: 3, path: '/assets/img/character-images/character_4.png' },
    { id: 4, path: '/assets/img/character-images/character_5.png' },
    { id: 5, path: '/assets/img/character-images/character_6.png' }
  ];

  newUserData: FormGroup;
  currentUserData: UserData;

  constructor(private fb: FormBuilder) {
    this.newUserData = this.fb.group({
      name: ['', [Validators.required, this.fullNameValidator]],
      email: ['', [Validators.required, Validators.email]]
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

  /**
   * Custom validator to check if the input is a full name (two words).
   * @param {AbstractControl} control - The form control to validate.
   * @returns {ValidationErrors | null} An object with validation errors or null if the control is valid.
   */
  fullNameValidator(control: AbstractControl): ValidationErrors | null {
    const fullNamePattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
    return fullNamePattern.test(control.value) ? null : { fullName: true };
  }

  /**
   * Checks if the form control has a specific error.
   * @param {string} controlName - The name of the form control.
   * @param {string} errorName - The name of the error to check.
   * @returns {boolean} True if the error exists, false otherwise.
   */
  hasError(controlName: string, errorName: string): boolean {
    return this.newUserData.get(controlName)?.hasError(errorName) ?? false;
  }


  saveProfile() {
    const updates: Partial<UserData> = this.newUserData.value;
    this.firebaseService.updateUserProfile(updates)
      .then(() => {
        console.log('User profile updated successfully');
        console.log('New user data for auth service: ', this.newUserData.value.email);
        //this.authService.changeEmail(this.newUserData.value.email); to-do verfiy new email, if new email is verfied then update the email

        this.toggleUserProfile(false);
      })
      .catch(error => {
        console.error('Error updating user profile: ', error);
      });
  }

  setNewAvatar(index: number) {
    console.log('Avatar index: ', index);
    this.newAvatarPath = this.avatarList[index].path;
    console.log('New avatar path: ', this.newAvatarPath);
    this.newAvatarChosen = true;
  }

  updateAvatar() {
    if (this.newAvatarChosen) {
      this.firebaseService.updateUserAvatar(this.newAvatarPath)
        .then(() => {
          console.log('User avatar updated successfully');
          this.toggleEditAvatar();
        })
        .catch((error: any) => {
          console.error('Error updating user avatar: ', error);
        });
    }
  }

  onCancel(name:string): void {
    if (name === 'editProfile') {
      this.newUserData.reset(this.currentUserData);
      this.toggleEditProfile();
    } else if (name === 'editAvatar') {
      this.toggleEditAvatar();
      this.newAvatarChosen = false;
      this.newAvatarPath = '';
    }

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

	/**
	 * Handles the mouse over event for the sideNav icons.
	 * Changes the icon source based on the provided image name.
	 */
	onMouseOver(): void {
    this.currentIconSourceClose = this.closeHover;
	}

	/**
	 * Handles the mouse out event for the specified image.
   * Changes the icon source based on the provided image name.
	 */
	onMouseOut(): void {
    this.currentIconSourceClose = this.close;
	}

}
