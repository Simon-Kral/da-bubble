import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  constructor(private router: Router) { }

  navigateToNewMessage() {
    this.router.navigate(['/home/new-message']);
  }

  navigateToChannel() {
    this.router.navigate(['/home/channel']);
  }
}
