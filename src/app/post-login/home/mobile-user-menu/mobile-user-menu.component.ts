import { Component, inject, Inject } from '@angular/core';
import { CommunicationService } from '../../../services/communication/communication.service';

@Component({
  selector: 'app-mobile-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './mobile-user-menu.component.html',
  styleUrl: './mobile-user-menu.component.scss'
})
export class MobileUserMenuComponent {

  communicationService = inject(CommunicationService);

}
