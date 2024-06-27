import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [],
  animations: [
    trigger('move', [
      state('false', style({
        height: '140px'
      })),
      state('true', style({
        height: '70px',
        top: '0',
        left: '0',
      })),
      transition('* => *', animate('500ms 2.5s')) // orig
      // transition('* => *', animate('500ms ease')) // testing
      // ,
      // state('true', style({

      // })
      // )
    ])
  ],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {
  moveStarted: boolean = false;
  expandStarted: boolean = false;
  
  constructor() {
    this.moveStarted = true;
  }
}
