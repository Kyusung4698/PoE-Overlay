import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsFeatureContainerComponent } from './settings-feature-container.component';

describe('SettingsFeatureContainerComponent', () => {
  let component: SettingsFeatureContainerComponent;
  let fixture: ComponentFixture<SettingsFeatureContainerComponent>;

  beforeEach(async(() => {
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
