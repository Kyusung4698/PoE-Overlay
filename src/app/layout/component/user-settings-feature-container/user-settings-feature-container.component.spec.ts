import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsFeatureContainerComponent } from './user-settings-feature-container.component';

describe('UserSettingsFeatureContainerComponent', () => {
  let component: UserSettingsFeatureContainerComponent;
  let fixture: ComponentFixture<UserSettingsFeatureContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsFeatureContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
