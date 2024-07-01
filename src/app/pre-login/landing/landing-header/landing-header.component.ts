import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicComponentService } from '../../../services/dynamic-component/dynamic-component.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

const enterIntro = transition(":enter", [
  group([
    query(".logo_with_text > img", [
      style({
        marginLeft: 'calc(589px / 2 - 70px)',
      }),
      animate('200ms 500ms', style({
        marginLeft: '0',
      }))
    ]),
    query(".span_wrap > span", [
      style({
        marginLeft: '-500px',
      }),
      animate('300ms 900ms', style({
        marginLeft: '0%',
      }))
    ]),
    query(".logo_with_text", [
      style({
        height: '140px',
        top: 'calc(50vh - 70px)',
        left: 'calc(50% - 589px / 2)',
      }),
      animate('500ms 2.5s',
        style({
          height: '70px',
          top: '0',
          left: '0',
        })
      )
    ]),
    query(".span_wrap > span", [
      style({
        fontSize: '90px',
        color: 'white'
      }),
      animate('500ms 2.5s', style({
        fontSize: '24px',
        color: 'black'
      }))
    ]),
    query(".overlay", [
      style({
        opacity: '1'
      }),
      animate('500ms 2.5s', style({
        opacity: '0'
      }))
    ])
  ])
])

const intro = trigger("intro", [enterIntro]);

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [
    NgIf
  ],
  animations: [intro],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {
  introAnimationStarted: boolean = false;
  introAnimationFinished: boolean = false;
  
  constructor(private dynamicComponentService: DynamicComponentService) {
    this.introAnimationStarted = true;
  }

  onAnimationDone(event: any) {
    console.log("onAnimationDone", event);
    this.introAnimationFinished = true;
  }

  loadLogin() {
    this.dynamicComponentService.setComponent(LoginComponent);
  }

  loadRegister() {
    this.dynamicComponentService.setComponent(RegisterComponent);
  }
}