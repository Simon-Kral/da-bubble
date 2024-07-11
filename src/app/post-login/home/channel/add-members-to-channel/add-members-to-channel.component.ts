import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-members-to-channel',
  standalone: true,
  imports: [],
  templateUrl: './add-members-to-channel.component.html',
  styleUrl: './add-members-to-channel.component.scss'
})
export class AddMembersToChannelComponent {
	@Input() isAddMembersToChannelVisible = false;
	@Output() addMembersToChannelVisibilityChange = new EventEmitter<boolean>();
	
}
