import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsHelpComponent } from './user-settings-help.component';

describe('UserSettingsHelpComponent', () => {
  let component: UserSettingsHelpComponent;
  let fixture: ComponentFixture<UserSettingsHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
