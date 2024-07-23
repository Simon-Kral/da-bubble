import { Component, inject, Inject } from '@angular/core';
import { CommunicationService } from '../../../services/communication/communication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-user-menu.component.html',
  styleUrl: './mobile-user-menu.component.scss'
})
export class MobileUserMenuComponent {

  communicationService = inject(CommunicationService);

  activeMenu: string = '';

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }
}
