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
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import {
	Firestore,
	collection,
	onSnapshot,
	orderBy,
	query,
	addDoc,
	doc,
	updateDoc,
} from '@angular/fire/firestore';
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
	styleUrl: './current-user-profile.component.scss',
})
export class CurrentUserProfileComponent implements OnInit {
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

	constructor(private fb: FormBuilder) {
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
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	ngOnInit() {
		this.searchGoogleProvider();
	}

	/**
	 * Searches for the google provider in the current user's list of providers and sets googleProviderExists true or false.
	 * Users that are authenticated with google signup must not change their profile.
	 * @returns {void}
	 */
	searchGoogleProvider(): void {
		const providers: string[] = [];
		this.authService.firebaseAuth.currentUser!.providerData.forEach(
			(provider) => {
				providers.push(provider.providerId);
			}
		);
		this.googleProviderExists = providers.includes('google.com');
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

	/**
	 * Extracts the new user data from the form and initializes the change of the user's email adress.
	 * Then updates the user's document in Firebase.
	 * @returns {void}
	 */
	saveProfile(): void {
		const updates: Partial<UserData> = this.newUserData.value;
		// todo don't changeEmail if not changed
		// todo update displayName in authService
		this.authService
			.changeEmail(
				this.newUserData.value.email,
				this.newUserData.value.password
			)
			.subscribe({
				next: () => {
					this.updateFirebaseData(updates).then(() => {
						this.logout();
					});
				},
				error: (err) => {
					console.log(err);
				},
			});
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
				this.toggleUserProfile(false);
			})
			.catch((error) => {
				console.error('Error updating user profile: ', error);
			});
	}

	/**
	 * Logs the user out and performs cleanup actions.
	 * @returns {void}
	 */
	logout(): void {
		// to-do OPTIONAL update user status to offline when close tab
		this.firebaseService.updateUserStatus(false);
		this.firebaseService.clearCurrentUser(); // to-do remove after developement is finished
		this.firebaseService.ngOnDestroy();
		this.authService.logout().subscribe({
			next: () => {
				sessionStorage.clear();
			},
			error: (err) => {
				console.log(err);
			},
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
			this.firebaseService
				.updateUserAvatar(this.newAvatarPath)
				.then(() => {
					console.log('User avatar updated successfully');
					this.toggleEditAvatar();
				})
				.catch((error: any) => {
					console.error('Error updating user avatar: ', error);
				});
		}
	}

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
