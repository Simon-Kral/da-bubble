import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  constructor() { }
  
  private componentSubject = new BehaviorSubject<any>(null);
  component$ = this.componentSubject.asObservable();

  setComponent(component: any) {
    this.componentSubject.next(component);
  }
}