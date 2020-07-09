import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSupportComponent } from './settings-support.component';

describe('SettingsSupportComponent', () => {
  let component: SettingsSupportComponent;
  let fixture: ComponentFixture<SettingsSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
