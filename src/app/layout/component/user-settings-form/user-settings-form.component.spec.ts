import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFormComponent } from './user-settings-form.component';


describe('UserSettingsComponent', () => {
  let component: UserSettingsFormComponent;
  let fixture: ComponentFixture<UserSettingsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserSettingsFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsFormComponent);
    component = fixture.componentInstance;
    component.settings = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
