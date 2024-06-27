import { Component } from '@angular/core';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingFooterComponent,
    LoginComponent,
    CreateAccountComponent,
    ResetPasswordComponent,
    NgIf,
  ],
  animations: [
    trigger('fadeOut', [
      state('true', style({
        opacity: '1'
      })),
      state('false', style({
        opacity: '0'
      })),
      // transition('* => *', animate('500ms 2.5s')) // orig
      transition('* => *', animate('500ms ease')) // testing
    ])
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  isShown: boolean = true;
  
  constructor() {
    this.isShown = false;
  }
}
