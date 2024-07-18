import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../../services/authentication/auth.service';
import { ChatService } from '../../../services/chat/chat.service';
import { CommunicationService } from '../../../services/communication/communication.service';
import { AppComponent } from '../../../app.component';
interface UserData {
	name: string;
	email: string;
}

@Component({
	selector: 'app-current-user-profile',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './current-user-profile.component.html',
	styleUrl: './current-user-profile.component.scss',
})
export class CurrentUserProfileComponent implements OnInit {
	firestore: Firestore = inject(Firestore);
	firebaseService = inject(FirebaseService);
	authService = inject(AuthService);
	chatService = inject(ChatService);
	communicationService = inject(CommunicationService);

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

	avatarList: Array<{ id: number; path: string }> = [
		{ id: 0, path: '/assets/img/character-images/character_1.png' },
		{ id: 1, path: '/assets/img/character-images/character_2.png' },
		{ id: 2, path: '/assets/img/character-images/character_3.png' },
		{ id: 3, path: '/assets/img/character-images/character_4.png' },
		{ id: 4, path: '/assets/img/character-images/character_5.png' },
		{ id: 5, path: '/assets/img/character-images/character_6.png' },
	];

	newUserData: FormGroup;
	currentUserData: UserData;

	googleProviderExists: boolean = false;
	userIsGuest: boolean = false;

	constructor(private fb: FormBuilder, public appComponent: AppComponent) {
		this.currentUserData = {
			name: this.firebaseService.getUserDisplayName(
				this.firebaseService.currentUserId
			),
			email: this.firebaseService.getUserEmail(
				this.firebaseService.currentUserId
			),
		};
		this.newUserData = this.fb.group({
			name: [
				this.currentUserData.name,
				[Validators.required, this.fullNameValidator],
			],
			email: [
				this.currentUserData.email,
				[Validators.required, Validators.email],
			],
			password: [''],
		});
	}

	ngOnInit() {
		this.searchProvider();
		this.newUserData.get('email')?.valueChanges.subscribe(() => {
			if (this.emailHasChanged(this.newUserData.controls['email'])) {
				this.newUserData.controls['password'].addValidators([
					Validators.required,
					Validators.minLength(6),
				]);
				this.newUserData.controls['password'].updateValueAndValidity();
			} else {
				this.newUserData.controls['password'].clearValidators();
				this.newUserData.controls['password'].updateValueAndValidity();
			}
		});
	}

	/**
	 * Searches for the google provider in the current user's list of providers and sets googleProviderExists true or false.
	 * Users that are authenticated with google signup must not change their profile.
	 * @returns {void}
	 */
	searchProvider(): void {
		const providers: string[] = [];
		this.authService.firebaseAuth.currentUser!.providerData.forEach(
			(provider) => {
				providers.push(provider.providerId);
			}
		);
		this.googleProviderExists = providers.includes('google.com');
		this.userIsGuest = providers.length === 0;
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

	emailHasChanged = (control: AbstractControl): string | null => {
		const initialEmailAuth =
			this.authService.firebaseAuth.currentUser!.email;
		const initialEmailDB = this.currentUserData.email;
		return (control.touched || control.dirty) &&
			!((initialEmailAuth || initialEmailDB) === control.value)
			? 'Bitte bestätigen Sie Ihr Passwort.'
			: null;
	};

	/**
	 * Checks if the form control has a specific error.
	 * @param {string} controlName - The name of the form control.
	 * @param {string} errorName - The name of the error to check.
	 * @returns {boolean} True if the error exists, false otherwise.
	 */
	hasError(controlName: string, errorName: string): boolean {
		return this.newUserData.get(controlName)?.hasError(errorName) ?? false;
	}

	/**
	 * Extracts the new user data from the form and initializes the change of the user's email adress.
	 * Then updates the user's document in Firebase.
	 * @returns {void}
	 */
	saveProfile(): void {
		const updates: Partial<UserData> = this.newUserData.value;
		// todo don't changeEmail if not changed
		// todo update displayName in authService
		if (this.emailHasChanged(this.newUserData.controls['email'])) {
			this.authService
				.changeEmail(
					this.newUserData.value.email,
					this.newUserData.value.password
				)
				.subscribe({
					next: () => {
						this.appComponent.notificateUser('E-Mail gesendet');
						this.updateFirebaseData(updates).then(() => {
							this.logout();
						});
					},
					error: (err) => {
						console.log(err);
					},
				});
		} else {
			this.updateFirebaseData(updates).then(() => {
				this.communicationService.toggleCurrentUserProfileVisibility(
					true
				);
				this.toggleEditProfile();
			});
		}
	}

	/**
	 * Takes a partial user data object and updates the user's document in Firebase.
	 * @param {Partial<UserData>} updates - An object containing the user data fields to be updated.
	 * @returns {Promise<void>} A promise that resolves when the update operation completes.
	 */
	async updateFirebaseData(updates: Partial<UserData>): Promise<void> {
		return this.firebaseService
			.updateUserProfile(updates)
			.then(() => {
				console.log('User profile updated successfully');
				this.toggleCurrentUserProfile(false);
			})
			.catch((error) => {
				console.error('Error updating user profile: ', error);
			});
	}

	/**
	 * Logs the user out and performs cleanup actions.
	 * @returns {void}
	 */
	async logout(): Promise<void> {
		// to-do OPTIONAL update user status to offline when close tab
		await this.firebaseService.unsubscribeAllLists();
		await this.chatService.unsubscribeAllLists();
		await this.firebaseService.updateUserStatus(false);
		this.firebaseService.clearCurrentUser(); // to-do remove after developement is finished
		this.authService.logout().subscribe({
			next: () => {
				sessionStorage.clear();
			},
			error: (err) => {
				console.log(err);
			},
		});
	}
	/**
	 * Sets a new avatar path based on the provided index from the avatar list.
	 * @param {number} index - The index of the avatar in the avatar list.
	 */
	setNewAvatar(index: number) {
		this.newAvatarPath = this.avatarList[index].path;
		this.newAvatarChosen = true;
	}

	/**
	 * Updates the user's avatar if a new avatar has been chosen.
	 * Calls the `updateUserAvatar` method from `firebaseService` to update the photoURL in Firestore users collection.
	 * Toggles the edit avatar overlay upon successful avatar update.
	 * Logs a warning message if an error occurs during the avatar update. to-do: handle error diffrently?!?
	 */
	updateAvatar() {
		if (this.newAvatarChosen) {
			this.firebaseService
				.updateUserAvatar(this.newAvatarPath)
				.then(() => {
					this.toggleEditAvatar();
				})
				.catch((error: any) => {
					console.warn('Error updating user avatar: ', error);
				});
		}
	}

	/**
	 * Handles cancel actions for different modals.
	 * @param {string} name - The name of the modal to cancel ('editProfile' or 'editAvatar').
	 * @returns {void}
	 */
	onCancel(name: string): void {
		if (name === 'editProfile') {
			this.newUserData.reset(this.currentUserData);
			this.toggleEditProfile();
		} else if (name === 'editAvatar') {
			this.toggleEditAvatar();
			this.newAvatarChosen = false;
			this.newAvatarPath = '';
		}
	}

	/**
	 * Toggles the visibility of the current user's profile.
	 * @param {boolean} visible - Indicates whether to show or hide the current user's profile.
	 * @returns {void}
	 */
	toggleCurrentUserProfile(visible: boolean) {
		this.currentUserProfileVisibilityChange.emit(visible);
	}

	/**
	 * Toggles the visibility of the edit profile interface.
	 * @returns {void}
	 */
	toggleEditProfile() {
		this.isEditProfileVisible = !this.isEditProfileVisible;
	}

	/**
	 * Toggles the visibility of the avatar editing interface.
	 * @returns {void}
	 */
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
