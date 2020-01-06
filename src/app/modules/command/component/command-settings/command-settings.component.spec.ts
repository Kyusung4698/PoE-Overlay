import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { CommandSettingsComponent } from './command-settings.component';


describe('CommandSettingsComponent', () => {
  let component: CommandSettingsComponent;
  let fixture: ComponentFixture<CommandSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [CommandSettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandSettingsComponent);
    component = fixture.componentInstance;
    component.settings = {
      commands: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
