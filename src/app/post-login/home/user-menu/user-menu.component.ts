import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {

  @Input() isUserMenuVisible: boolean = false;
  @Output() userMenuVisibilityChange = new EventEmitter<boolean>();

}
