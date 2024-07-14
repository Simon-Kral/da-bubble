import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CommunicationService {
	//prvt msg component
	showPrivateNote: boolean = false;

	// moved from chat.service -- variabels for currentUser & userProfile visibility

	isCurrentUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
	isCurrentUserProfileVisible$ = this.isCurrentUserProfileVisibleSource.asObservable();
	isUserProfileVisibleSource = new BehaviorSubject<boolean>(false);
	isUserProfileVisible$ = this.isUserProfileVisibleSource.asObservable();
	
	isChannelDetailsVisibleSource = new BehaviorSubject<boolean>(false);
	isChannelDetailsVisible$ =this.isChannelDetailsVisibleSource.asObservable();

	isAddMembersToChannelVisibleSource = new BehaviorSubject<boolean>(false);
	isAddMembersToChannelVisible$ = this.isAddMembersToChannelVisibleSource.asObservable();

	isChannelMemberVisibleSource = new BehaviorSubject<boolean>(false);
	isChannelMemberVisible$ = this.isChannelMemberVisibleSource.asObservable();

	// moved from home.component -- variabels thread visibility
	//thread variables
	isThreadVisible: boolean = false;



	constructor() {}

	//prvt msg component
	togglePrivateNote(visible: boolean) {
		if (visible) {
			this.showPrivateNote = true;
		} else {
			this.showPrivateNote = false;
		}
	}

	toggleThreadVisibility(visible: boolean) {
		this.isThreadVisible = !this.isThreadVisible;
	}


	toggleCurrentUserProfileVisibility(visible: boolean) {
		this.isCurrentUserProfileVisibleSource.next(visible);
	}
	
	toggleUserProfileVisibility(visible: boolean) {
		this.isUserProfileVisibleSource.next(visible);
	}

	toggleChannelDetailsVisibility(visible: boolean) {
		this.isChannelDetailsVisibleSource.next(visible);
	}

	toggleAddMembersToChannelVisibility(visible: boolean) {
		this.isAddMembersToChannelVisibleSource.next(visible);
	}

	toggleChannelMemberVisibility(visible: boolean) {
		this.isChannelMemberVisibleSource.next(visible);
	}
}
