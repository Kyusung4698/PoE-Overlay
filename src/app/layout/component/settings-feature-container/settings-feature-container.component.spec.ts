import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsFeatureContainerComponent } from './settings-feature-container.component';

describe('SettingsFeatureContainerComponent', () => {
  let component: SettingsFeatureContainerComponent;
  let fixture: ComponentFixture<SettingsFeatureContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsFeatureContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFeatureContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
