import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { LandingHeaderComponent } from './landing-header/landing-header.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { NgIf } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DynamicComponentService } from '../../services/dynamic-component/dynamic-component.service';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingFooterComponent,
    RegisterComponent,
    NgIf,
  ],
  animations: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) 
  dynamicComponentContainer!: ViewContainerRef;

  constructor(private dynamicComponentService: DynamicComponentService) {}

  ngOnInit() {
    this.dynamicComponentService.component$.subscribe(component => {
      if (component) {
        this.loadComponent(component);
      }
    });
    this.dynamicComponentService.setComponent(LoginComponent);
  }

  loadComponent(componentType: any) {
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(componentType);
  }
}
