import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	inject,
	output,
} from '@angular/core';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
	authService = inject(AuthService);
	router = inject(Router);
	firebaseService = inject(FirebaseService);
	searchService = inject(SearchService);

	searchText: FormGroup;
	//user profile
	@Output() userProfileToggle = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder) {
		this.searchText = this.fb.group({
			search: [''],
		});
	}

	ngOnInit() {}

	/**
	 * Executes when the search input changes.
	 * Retrieves the current search value from the form and
	 * notifies the SearchService with the updated search text.
	 */
	onSearch() {
		let searchValue = this.searchText.get('search')?.value;
		let source = 'headerComponent';
		this.searchService.onSearch(searchValue, source);
	}

	//user profile functions
	toggleUserProfile(visible: boolean) {
		this.userProfileToggle.emit(visible);
	}
}
