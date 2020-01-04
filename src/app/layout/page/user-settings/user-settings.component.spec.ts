import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronProvider } from '@app/provider';
import { FEATURE_MODULES } from '@app/token';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsComponent } from './user-settings.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserSettingsComponent],
      providers: [
        {
          provide: FEATURE_MODULES,
          useValue: []
        },
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
