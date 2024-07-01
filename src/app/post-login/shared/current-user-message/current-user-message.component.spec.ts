import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserMessageComponent } from './current-user-message.component';

describe('CurrentUserMessageComponent', () => {
  let component: CurrentUserMessageComponent;
  let fixture: ComponentFixture<CurrentUserMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentUserMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentUserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
