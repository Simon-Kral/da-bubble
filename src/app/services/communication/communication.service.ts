import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CommunicationService {
	//prvt msg component  to-do: do we really need this?
	showPrivateNote: boolean = false;

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


	//thread variables
	isThreadVisible: boolean = false;

	// user profile variabels
	userProfileId: string = ''; // is getting used to store userId of the user whose profile is being viewed
	// delete msg dialog
	isDeleteMsgDialogVisible: boolean = false;
	constructor() {}



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

	handleClickOnUser(memberId: string) {
		this.toggleUserProfileVisibility(true);
		this.userProfileId = memberId;
	  }
	
	 handleClickCurrentUser(visible: boolean) {
		this.toggleCurrentUserProfileVisibility(visible);
	  }
}
